var express = require("express");
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public/"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var mangPlayer = [];

function Player(id, hoten){
    this.ID = id;
    this.HOTEN = hoten;
}

var dem = 10;

function Dem(){
    dem = dem - 1;
    console.log(dem);
    setTimeout(Dem, 1000);
}

io.on("connection", function(socket){
    console.log("New connection " + socket.id);

    socket.on("tao-room", function(data){
        // socket.adapter.rooms
        socket.join(data, function(err){
            console.log("ok");
            socket.RoomMoiNhat = data;
            io.sockets.emit("server-gui-ds-room", 
            socket.adapter.rooms);
        });
        
    });

    socket.on("chat", function(data){
        io.sockets.in(socket.RoomMoiNhat).emit(
            "server-chat", data
        );
    });

    socket.on("admin-chon", function(){

        Dem();

        console.log("Admin click Chon");
        /*var r = Math.floor(Math.random() * mangPlayer.length);
        var socketWin = mangPlayer[r].ID;
        io.to(socketWin).emit("server-bao-winner");  */
    });

    socket.on("player-gui-ten", function(data){
        socket.HoTen = data;
        mangPlayer.push(
            new Player(socket.id, socket.HoTen)
        );
        console.log(mangPlayer[0].HOTEN);
        io.sockets.emit("server-gui-ds", mangPlayer);    
    });

});

app.get("/player", function(req, res){
    res.render("player");
});

app.get("/admin", function(req, res){
    res.render("admin");
});

app.get("/chat", function(req, res){
    res.render("chat");
});
