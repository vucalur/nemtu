final IP = container.env['OPENSHIFT_VERTX_IP'] ?: '127.0.0.1'
final PORT = container.env['OPENSHIFT_VERTX_PORT']?.toInteger() ?: 8080


def logBindResult = { asyncResult ->
  if (asyncResult.succeeded) {
    println "Successfully listening on $IP:$PORT"
  } else {
    println "Could not bind to $IP:$PORT. $asyncResult"
  }
}

vertx.createHttpServer().requestHandler { req ->
  def file = req.path == '/' ? 'index.html' : req.path
  println("Serving: ${file}")
  req.response.sendFile "dist/$file"
}.listen(PORT, IP, logBindResult)
