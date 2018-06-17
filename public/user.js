class Block {
    constructor(index, previousHash, timestamp, data, createName, winner, money, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.createName = createName;
        this.winner = weinner;
        this.money = money;
        this.hash = hash.toString();
    }
}

function createFirstBlock() {
 	var firstBlock = new Block(0, "0", 1465154705, "my genesis block!!", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
    var boof = JSON.stringify(firstBlock);
    fs.writeFileSync(__dirname + '/test.txt', boof);
}