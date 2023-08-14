const StakeLog = require('../models/stakeLogModel');
const Web3 = require('web3');
const ethers = require('ethers');
const CALADEX_ABI = require('./caladexABI.json');
const Balance = require('../models/balanceModel');
const Stake = require('../models/stakeModel');
const Token = require('../models/tokenModel');
const TokenInfo = require('../models/tokenInfoModel');
const Trade = require('../models/tradeModel');
const Order = require('../models/orderModel');
const TradingView = require('../models/tradingViewModel');
const { getExecutionPrice } = require('./uniswapPrice');

const CurrentTime = () => {
    let date = new Date();
    date.setHours(date.getHours()-4);
    return date;
}

exports.updateTokenInfo = async (updateVolume) => {
    try {
        console.log("tokeninfo");

        const tokens = await Token.find({status: "approved"});
        // console.log(tokens);
        for(let token of tokens) {
            if(token.symbol == "ETH" || token.symbol == "DAI")
                continue;
            if(token.pair_type.includes("DAI")) {
                // console.log(trades);e.price * trade.amount;

                let date = CurrentTime();
                let curdate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), -7);
                curdate = curdate.toISOString().replace('Z', '').replace('T', ' ');

                let buyTrade = await Order.find({type: "buy", is_traded: false, token_id:token._id, pair_token: "DAI"}).sort({price: -1});
                buy_price = buyTrade[0] ? buyTrade[0].price : 0;
                let sellTrade = await Order.find({type: "sell", is_traded: false, token_id:token._id, pair_token: "DAI"}).sort({price: 1});
                sell_price = sellTrade[0] ? sellTrade[0].price : 0;
                date = CurrentTime();
                // let dayBeforeTradeInfo = await TokenInfo.find({token_id: token._id, pair_token: "DAI", time: { $lte: date.setHours(date.getHours() - 1) }}).sort({time: -1});
                // dayBeforeTradeInfo = dayBeforeTradeInfo[0];
                let lastTrade = await Trade.findOne({token_id: token._id, pair_token: "DAI"}).sort({time: -1});

                let tokenInfo = await TokenInfo.findOne({token_id: token._id, pair_token: "DAI"});
                if(!tokenInfo) {
                    tokenInfo = new TokenInfo;
                    tokenInfo.token_id = token._id;
                    tokenInfo.pair_token = "DAI"; 
                }
                tokenInfo.time = date;
                // tokenInfo.price = await getExecutionPrice(token.address, token.decimal, DAI.address, DAI.decimal, "1000000000");
                // console.log(tokenInfo.price);

                if(token.symbol == "CAX" && buy_price == 0) buy_price = 0.0301;
                if(token.symbol == "CAX" && sell_price == 0) sell_price = 0.0301; 
                tokenInfo.price = (sell_price + buy_price) / 2;
                tokenInfo.last_price = lastTrade ? lastTrade.price : 0;
                tokenInfo.market_sell_price = buy_price;
                tokenInfo.market_buy_price = sell_price;

                console.log(lastTrade, updateVolume, tokenInfo.volume);
                tokenInfo.volume += lastTrade ? lastTrade.amount * updateVolume : 0;
                console.log(tokenInfo.volume)
                let trades = await Trade.find({token_id : token._id, pair_token : "DAI"})
                                    .where('time').gte(curdate).sort({price : -1});
                if(trades.length > 0) {
                    tokenInfo.day_high = trades[0].price;
                    tokenInfo.day_low = trades[trades.length - 1].price;
                } else {
                    tokenInfo.day_high = tokenInfo.price;
                    tokenInfo.day_low = tokenInfo.price;
                }
                trades = await Trade.find({token_id : token._id, pair_token : "DAI"})
                                    .where('time').lt(curdate).sort({time : -1});
                let stprice = trades.length > 0 ? trades[0].price : 0;
                trades = await Trade.find({token_id : token._id, pair_token : "DAI"}).sort({time : -1});
                let ltprice = trades.length > 0 ? trades[0].price : 0;

                let deltaprice = ltprice - stprice;
                tokenInfo.day_change = deltaprice * 100 / stprice;

                

                await tokenInfo.save();


                /*const token_p = await Token.findOne({symbol: "DAI"});

                
                buyTrade = await Order.find({type: "buy", is_traded: false, token_id:token_p._id, pair_token: token.symbol}).sort({price: -1});
                buy_price = buyTrade[0] ? buyTrade[0].price : 0;
                sellTrade = await Order.find({type: "sell", is_traded: false, token_id:token_p._id, pair_token: token.symbol}).sort({price: 1});
                sell_price = sellTrade[0] ? sellTrade[0].price : 0;
                date = CurrentTime();
                // let dayBeforeTradeInfo = await TokenInfo.find({token_id: token._id, pair_token: "DAI", time: { $lte: date.setHours(date.getHours() - 1) }}).sort({time: -1});
                // dayBeforeTradeInfo = dayBeforeTradeInfo[0];
                lastTrade = await Trade.find({token_id: token_p._id, pair_token: token.symbol}).sort({time: -1});
                lastTrade = lastTrade[0];

                tokenInfo = await TokenInfo.findOne({token_id: token_p._id, pair_token: token.symbol});
                if(!tokenInfo) {
                    tokenInfo = new TokenInfo;
                    tokenInfo.token_id = token_p._id;
                    tokenInfo.pair_token = token.symbol; 
                }
                tokenInfo.time = date;

                if(token.symbol == "CAX" && buy_price == 0) buy_price = 1 / 0.0301;
                if(token.symbol == "CAX" && sell_price == 0) sell_price = 1 / 0.0301; 

                tokenInfo.price = (sell_price + buy_price) / 2;
                tokenInfo.last_price = lastTrade ? lastTrade.price : 0;
                tokenInfo.market_sell_price = buy_price;
                tokenInfo.market_buy_price = sell_price;
                tokenInfo.volume += lastTrade ? lastTrade.amount * updateVolume : 0;

                await tokenInfo.save();*/
                // console.log(tokenInfo);
            }
            if(token.pair_type.includes("ETH")) {
                
                let date = CurrentTime();

                let buyTrade = await Order.find({type: "buy", is_traded: false, token_id:token._id, pair_token: "ETH"}).sort({price: -1});
                buy_price = buyTrade[0] ? buyTrade[0].price : 0;
                let sellTrade = await Order.find({type: "sell", is_traded: false, token_id:token._id, pair_token: "ETH"}).sort({price: 1});
                sell_price = sellTrade[0] ? sellTrade[0].price : 0;
                date = CurrentTime();
                // let dayBeforeTradeInfo = await TokenInfo.find({token_id: token._id, pair_token: "DAI", time: { $lte: date.setHours(date.getHours() - 1) }}).sort({time: -1});
                // dayBeforeTradeInfo = dayBeforeTradeInfo[0];
                let lastTrade = await Trade.find({token_id: token._id, pair_token: "ETH"}).sort({time: -1});
                lastTrade = lastTrade[0];

                let tokenInfo = await TokenInfo.findOne({token_id: token._id, pair_token: "ETH"});
                if(!tokenInfo) {
                    tokenInfo = new TokenInfo;
                    tokenInfo.token_id = token._id;
                    tokenInfo.pair_token = "ETH";
                }
                tokenInfo.time = date;
                tokenInfo.price = (sell_price + buy_price) / 2;
                tokenInfo.last_price = lastTrade ? lastTrade.price : 0;
                tokenInfo.market_sell_price = buy_price;
                tokenInfo.market_buy_price = sell_price;
                tokenInfo.volume += lastTrade ? lastTrade.amount * updateVolume : 0;

                await tokenInfo.save();
                // console.log(tokenInfo);

                
                /*const token_p = await Token.findOne({symbol: "ETH"});

                
                buyTrade = await Order.find({type: "buy", is_traded: false, token_id:token_p._id, pair_token: token.symbol}).sort({price: -1});
                buy_price = buyTrade[0] ? buyTrade[0].price : 0;
                sellTrade = await Order.find({type: "sell", is_traded: false, token_id:token_p._id, pair_token: token.symbol}).sort({price: 1});
                sell_price = sellTrade[0] ? sellTrade[0].price : 0;
                date = CurrentTime();
                // let dayBeforeTradeInfo = await TokenInfo.find({token_id: token._id, pair_token: "DAI", time: { $lte: date.setHours(date.getHours() - 1) }}).sort({time: -1});
                // dayBeforeTradeInfo = dayBeforeTradeInfo[0];
                lastTrade = await Trade.find({token_id: token_p._id, pair_token: token.symbol}).sort({time: -1});
                lastTrade = lastTrade[0];

                tokenInfo = await TokenInfo.findOne({token_id: token_p._id, pair_token: token.symbol});
                if(!tokenInfo) {
                    tokenInfo = new TokenInfo;
                    tokenInfo.token_id = token_p._id;
                    tokenInfo.pair_token = token.symbol; 
                }
                tokenInfo.time = date;
                tokenInfo.price = (sell_price + buy_price) / 2;
                tokenInfo.last_price = lastTrade ? lastTrade.price : 0;
                tokenInfo.market_sell_price = buy_price;
                tokenInfo.market_buy_price = sell_price;
                tokenInfo.volume += lastTrade ? lastTrade.amount * updateVolume : 0;

                await tokenInfo.save();*/
            }
        }
    }catch (err) {
        console.log(err);
    }
}

exports.getFinishStakeLog = async () => {

    const date = CurrentTime();
    
    StakeLog.where('is_finished').equals(false).where('finish_date').lte(date).populate('stake_id')
        .exec(async function (err, result) {
        if (err){
            console.log(err)
        }else{
            console.log("Unstake :", result);
            
            for(let stakelog of result) {

                let stake = await Stake.findOne({_id: stakelog.stake_id}).populate('token_id');
                let balance = await Balance.findOne({address: address, token_id: stake.token_id._id });
                
                if(stakelog.amount <= 0 && balance.stake_balance < amount) return;

                stakelog.is_finished = true;
                stakelog.save();

                const expired = Math.floor((date.getTime() - stakelog.begin_date.getTime()) / 1000 / 24 / 60 / 60);

                if(expired < stakelog.duration) {
                    balance.caladex_balance += stakelog.amount;
                    balance.stake_balance -= stakelog.amount;
                } else {
                    balance.caladex_balance += (stakelog.amount + stakelog.amount * stake.est_apy * expired / 100 / 365);
                    balance.stake_balance -= stakelog.amount;
                }

                balance.save();
            }
        }
    });
    
};

exports.updateTradingView = async () => {
    let date = CurrentTime();
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), -7);
    date = date.toISOString().replace('Z', '').replace('T', ' ');
    // console.log(date);

    const tokens = await Token.find({status: "approved"});
    // console.log(tokens);
    for(let token of tokens) {
        if(token.symbol == "ETH" || token.symbol == "DAI")
            continue;
        if(token.pair_type.includes("DAI")) {
            let tradingview = await TradingView.findOne({token_id : token._id, pair_token : "DAI"});
            if(!tradingview) tradingview = await TradingView.create({token_id : token._id, pair_token : "DAI"});
            
            let data = tradingview.information;
            tradingview.information = [];
            await tradingview.save();

            // console.log(tradingview.information, data);
            
            let trades = await Trade.find({token_id : token._id, pair_token : "DAI"})
                                    .where('time').lt(date).sort({time : -1});
            let price = trades.length > 0 ? trades[0].price : 0.0301;
            
            if(data.length == 0 || data[data.length - 1].x != date) {
                data.push({
                    x : date,
                    y : [price, price, price, price]
                });
            }
            
            trades = await Trade.find({token_id : token._id, pair_token : "DAI"}).sort({time : 1});
            // console.log(trades);
            if(trades.length > 0) {
                data[data.length - 1].y[3] = trades[trades.length - 1].price;
            }
            
            trades = await Trade.find({token_id : token._id, pair_token : "DAI"})
                                    .where('time').gte(date).sort({price : -1});

            if(trades.length > 0) {
                data[data.length - 1].y[1] = trades[0].price;
                data[data.length - 1].y[2] = trades[trades.length - 1].price;
            }

            tradingview.information = data;
            // console.log(tradingview.information, data);
            await tradingview.save();
            
        }
        if(token.pair_type.includes("ETH")) {
        }
    }
}