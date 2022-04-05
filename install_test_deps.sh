# Installs xblock-sdk and dependencies needed to run the tests suite.
# Run this script inside a fresh virtual environment.
pip install -r requirements.txt
rm -rf src/xblock-sdk
pip install -e git+https://github.com/openedx/xblock-sdk.git@4d0027a040aec1be1a22dc9a4b8fc667bba0ddba#egg=xblock-sdk
cd src/xblock-sdk/ && ls -la && pip install -r requirements/base.txt && pip install -r requirements/test.txt 
