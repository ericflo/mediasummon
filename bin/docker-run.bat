setlocal enableextensions
md %USERPROFILE%\mediasummon
docker container run -p 5000:5000 --mount type=bind,source=%USERPROFILE%\mediasummon,target=/mediasummon -it --rm ericflo/mediasummon:latest admin