from pathlib import Path
from setuptools import setup

__version__ = '0.0.1'

with open("requirements.txt", "r") as f:
    requirements = f.read().splitlines()

dir = Path(__file__).parent
long_description = (dir / "README.md").read_text()

test_requires = [
    'pytest',
]

setup(
    name="journal_api",
    version=__version__,
    author="obonyojimmy",
    author_email="cliffjimmy27@gmail.com",
    license="MIT",
    url="https://github.com/obonyojimmy/journal-app.git",
    description="Api service for personal journaling app",
    long_description=long_description,
    long_description_content_type="text/markdown",
    packages=["src"],
    #include_package_data=True,
    install_requires=requirements,
    zip_safe=True,
    extras_require={
        'test': test_requires,
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
    ],
)
