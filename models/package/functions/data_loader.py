import pandas as pd

def load_excel_data(filepath: str) -> pd.DataFrame:
    """
    Carga un archivo Excel y devuelve un DataFrame.

    Args:
        filepath (str): Ruta al archivo Excel.

    Returns:
        pd.DataFrame: DataFrame con los datos cargados.
    """
    try:
        df = pd.read_excel(filepath)
        print(f"Archivo cargado correctamente desde {filepath}")
        return df
    except FileNotFoundError:
        print(f"Error: El archivo {filepath} no fue encontrado.")
        raise
    except Exception as e:
        print(f"Error inesperado al cargar el archivo {filepath}: {e}")
        raise
def load_csv_data(filepath: str) -> pd.DataFrame:
    """
    Carga un archivo CSV y devuelve un DataFrame.

    Args:
        filepath (str): Ruta al archivo CSV.

    Returns:
        pd.DataFrame: DataFrame con los datos cargados.
    """
    try:
        df = pd.read_csv(filepath)
        print(f"Archivo cargado correctamente desde {filepath}")
        return df
    except FileNotFoundError:
        print(f"Error: El archivo {filepath} no fue encontrado.")
        raise
    except Exception as e:
        print(f"Error inesperado al cargar el archivo {filepath}: {e}")
        raise