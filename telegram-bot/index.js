const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '544858820:AAHEDHeEqRu15boYGdeBTmdwj_zX0hVMioY';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/curse (.+)/, (msg, match) => {
 

  const chatId = msg.chat.id;
  const resp = match[1]; 


  bot.sendMessage(chatId, 'Choose some currency', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '€ - EUR',
            callback_data: 'EUR'
          },
           {
            text: '$ - USD',
            callback_data: 'USD'
          },
           {
            text: '₽ - RUB',
            callback_data: 'RUB'
          },
           {
            text: '₿ - BTC',
            callback_data: 'BTC'
          }
        ]
      ]
    }
  });
});

bot.on('callback_query', query => {
  const id = query.message.chat.id;

  request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function (error, response, body) {
    const data = JSON.parse(body)
    const result = data.filter(item => item.ccy === query.data)[0];
    
    const flag = {
      'EUR': '🇪🇺',
      'USD': '🇺🇸',
      'RUR': '🇷🇺',
      'UAH': '🇺🇦',
      'BTC': '₿'
    }
    
    let md = `
      *${flag[result.ccy]} ${result.ccy} 💱 ${result.base_ccy} ${flag[result.base_ccy]}*
      Buy: _${result.buy}_
      Sale: _${result.sale}_
    `;
    bot.sendMessage(id, md, {parse_mode: 'Markdown'});  
  })
})