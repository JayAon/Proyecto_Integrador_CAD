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
  referencia: "SELECT referencia FROM referencias_unicas",
  maquina: "SELECT maquina FROM maquinas_unicas",
  seccion: "SELECT seccion FROM secciones_unicas",
  proceso: "SELECT proceso FROM procesos_unicos",
  usuario: "SELECT usuario FROM usuarios_unicos",
};

async function runQuery(query) {
  const startCmd = new StartQueryExecutionCommand({
    QueryString: query,
    QueryExecutionContext: { Database: database },
    ResultConfiguration: { OutputLocation: outputLocation },
  });
  const startRes = await client.send(startCmd);
  const queryExecutionId = startRes.QueryExecutionId;

  for (let i = 0; i < 15; i++) {
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
      return resultsRes.ResultSet.Rows.slice(1).map(
        (row) => row.Data[0].VarCharValue
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
    // Lee limit del query string
    const limit = Number(event.queryStringParameters?.limit) || 10;

    const result = {};
    for (const [key, baseQuery] of Object.entries(baseQueries)) {
      const query = `${baseQuery} LIMIT ${limit}`;
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
