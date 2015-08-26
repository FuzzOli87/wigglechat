var group = new Group({ transformContent: false, strokeJoin: 'round', strokeCap: 'round' }), amount = 8;
var color = randomColor();

addPath(color,'SELF');
emitPath(color)

function randomColor() { return { red: 0, green: Math.random(), blue: Math.random(), alpha: ( Math.random() * 0.80 ) + 0.05 }; }

function addPath(color, user) {
    var path = new Path({ strokeColor: color, strokeWidth: 5, name: user }), scale = (group.children.length + 1) * .1;

    for (var i = 0; i <= amount; i++) {
        if(i==4) { path.add(new Point(view.center.x, view.center.y)); } 
        if(i<4){ path.add(new Point(view.center.x - (amount * (4-i) * 10), view.center.y/2 * scale)); }
        if(i>4){ path.add(new Point(view.center.x + (amount * (i-4) * 10), view.center.y/2 * scale)); }
    }

    group.addChild(path);
    path.smooth();
    animate(group);
} 

function animate(group) {
    var newAnimation = function(event) {
        group.rotate(group.children.length * .1, view.center);
        for(var x = 0; x < group.children.length; x++) {
            for (var i = 0; i <= amount; i++) {
                if(i!=4) {
                    var segment = group.children[x].segments[i], sinus = Math.sin(event.time * 3 + i);
                    segment.point.y = view.center.y + sinus * (x+1) * 50;
                }
            }
        }
    }

    view.play();
    view.on('frame', newAnimation);
}
//
function emitPath(color) { io.emit('addPath', { color: color }); }

function emitOwnPath(color, origin) { io.emit('addOtherPaths', { color: color, originSock: origin }); }

io.on( 'newUser', function(id) { emitOwnPath(group.getItems({name: 'SELF'})[0].getStrokeColor(), id); });

io.on( 'addPath', function(data) { addPath(data.color, data.user); });

io.on( 'userDrop', function(id) { group.getItems({name: id })[0].remove(); });

$('form').submit(function() { io.emit('chat', $('#wName').val() + ': ' + $('#msg').val()); $('#msg').val(''); return false;});

io.on('chat', function(msg) { $('#msgs').append($('<li style="padding: 5px 10px">').text(msg)); });
