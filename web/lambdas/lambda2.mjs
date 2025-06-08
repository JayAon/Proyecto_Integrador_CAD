import {
  AthenaClient,
  StartQueryExecutionCommand,
  GetQueryExecutionCommand,
  GetQueryResultsCommand,
} from "@aws-sdk/client-athena";

const client = new AthenaClient({ region: process.env.region });
const database = process.env.database;
const outputLocation = process.env.output_location;

const baseQueries = {
  data: "SELECT * FROM raw",
};

function subtractDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

async function runQuery(query) {
  const startCmd = new StartQueryExecutionCommand({
    QueryString: query,
    QueryExecutionContext: { Database: database },
    ResultConfiguration: { OutputLocation: outputLocation },
  });
  const startRes = await client.send(startCmd);
  const queryExecutionId = startRes.QueryExecutionId;

  for (let i = 0; i < 5; i++) {
    const statusCmd = new GetQueryExecutionCommand({
      QueryExecutionId: queryExecutionId,
    });
    const statusRes = await client.send(statusCmd);
    const state = statusRes.QueryExecution.Status.State;

    if (state === "SUCCEEDED") {
      const resultsCmd = new GetQueryResultsCommand({
        QueryExecutionId: queryExecutionId,
      });
      const resultsRes = await client.send(resultsCmd);
      return resultsRes.ResultSet.Rows.slice(1).map((row) =>
        row.Data.map((cell) => cell.VarCharValue || null)
      );
    }

    if (state === "FAILED" || state === "CANCELLED") {
      throw new Error(`Query ${state}`);
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  throw new Error("Timeout esperando resultado de Athena");
}

export const handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};

    // Defaults
    const baseDate = queryParams.baseDate || "2024-01-01";
    const daysBack = Number(queryParams.daysBack);
    const useAllBefore = daysBack === -1;

    const startDate = useAllBefore
      ? null
      : subtractDays(baseDate, daysBack || 30);

    const result = {};

    for (const [key, baseQuery] of Object.entries(baseQueries)) {
      const whereClause = useAllBefore
        ? `WHERE fecha_inicio <= DATE '${baseDate}'`
        : `WHERE fecha_inicio BETWEEN DATE '${startDate}' AND DATE '${baseDate}'`;

      const query = `
        ${baseQuery}
        ${whereClause}
        ORDER BY fecha_inicio DESC
      `;

      result[key] = await runQuery(query);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
