SocketHelper = {

  findClients: function(io, roomId, namespace) {
    var res = []
    , ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
      for (var id in ns.connected) {
        if(roomId) {
          var index = ns.connected[id].rooms.indexOf(roomId) ;
          if(index !== -1) {
            res.push(ns.connected[id].id);
          }
        } else {
          res.push(ns.connected[id].id);
        }
      }
    }
    return res;
  }
}

module.exports = SocketHelper
