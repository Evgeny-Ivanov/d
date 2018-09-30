using JuliaWebAPI: APIInvoker, run_http

#Create the ZMQ client that talks to the ZMQ listener above
const apiclnt = APIInvoker("tcp://127.0.0.1:9999");

#Starts the HTTP server in current process
run_http(apiclnt, 8887)