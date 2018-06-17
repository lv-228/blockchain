//var http = require('http');
var fs = require('fs');
var bodyParser = require("body-parser");
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(express.static(__dirname + '/public'));
app.listen(3000, '127.0.0.1');
server.listen(8080);

class Block {
    constructor(index, previousHash, timestamp, data, createName, winner, money, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.createName = createName;
        this.winner = winner;
        this.money = money;
        this.hash = hash.toString();
    }

    inFile() {
    	fs.appendFileSync(__dirname + "/test1.json", '\r' + JSON.stringify(this, null, 2));
    	console.log(this);
    }

    lastBlock(){
    	var blockchain = fs.readFileSync(__dirname + '/test1.json', 'utf-8');
    	var jsonChain = JSON.parse(blockchain);
    	console.log(jsonChain[0]);
    }
};

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/blocks',(req,res) =>{
	var blockchain = fs.readFileSync(__dirname + '/test1.json', 'utf-8');
 	res.send(JSON.stringify(blockchain));
});

app.post('/create-block',urlencodedParser, (req,res)=>{
	console.log(req.body);
	var Blocktest = new Block(0, "0", 1465154705, "Next block",req.body.createName, req.body.winner, req.body.money, "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
	Blocktest.inFile();
	Blocktest.lastBlock();
	//var newBlock = generateNextBlock(req.body);
	// addBlock(newBlock);
	// console.log('block added: ' + JSON.stringify(newBlock));
	// var boof1 = JSON.stringify(Blocktest, null, 2);
 	// fs.writeFileSync(__dirname + '/test.json', boof1);
	res.send("true");
	});

var calculateHash = (index, previousHash, timestamp, data) => {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};

var generateNextBlock = (blockData) => {
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime() / 1000;
    var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
};

function createFirstBlock() {
 	var firstBlock = new Block(0, "0", 1465154705, "my genesis block!!","0", "0", 0, "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
    var boof = JSON.stringify(firstBlock, null, 2);
    fs.writeFileSync(__dirname + '/test.json', boof);
}

var isValidNewBlock = (newBlock, previousBlock) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
};

var replaceChain = (newBlocks) => {
    if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockchain = newBlocks;
        broadcast(responseLatestMsg());
    } else {
        console.log('Received blockchain invalid');
    }
};

// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('myevent', function (data) {
//   	createFirstBlock();
//   });
// });