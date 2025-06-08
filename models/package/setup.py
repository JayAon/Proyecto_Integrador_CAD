from setuptools import setup, find_packages

setup(
    name="my_project",           # nombre de tu proyecto
    version="0.1.0",
    packages=find_packages(),    # encuentra 'functions' automáticamente
    install_requires=[
        "fastapi",
        "uvicorn",
        "pandas",
        "scikit-learn",
        "boto3",
        "joblib",
    ],
    include_package_data=True,
)
