/* bot tg api version 0.1 test */

const fs = require('fs');

const path = require('path');

const TelegramBot = require('node-telegram-bot-api');

const API_KEY_BOT = '7851357757:AAFqPL-9bDPkr9cEDBhmDn_J7GLUtNENCgM';

//const authorizedUserId = ; // Сюда пишем айди аккаунта или нескольких аккаунтов для администрирования.

const bot = new TelegramBot(API_KEY_BOT, {polling: true});

//
const messagesFilePath = path.join(__dirname, 'SaveChats/telegram_messages.txt');
const dataFileName = 'dataBase/dataTextUsers.json';
//

//Функции для обработки команд.

function readData() 
{
  try 
  {
    const data = fs.readFileSync(dataFileName, 'utf8');

    return JSON.parse(data);
  } 
  
  catch (error) 
  {
    // Если файл не существует или содержит некорректный джайсон, возвращаем пустой объект.
    return {};
    console.lor(error);
  }

}

function writeData(data) 
{

  fs.writeFileSync(dataFileName, JSON.stringify(data, null, 2), 'utf8');

}

// Функция для отправки содержимого dataLinkOne.
async function sendDataJsonLinkOne(chatId) {
    try 
    {
        const dataContent = fs.readFileSync('dataBase/dataLinkOne.json', 'utf8');

        const data = JSON.parse(dataContent);

        // Формируем сообщение из полей объекта
        const message = Object.values(data).join('\n');

        await bot.sendMessage(chatId, message || 'Данных нет.');
    } 
    
    catch (error) 
    {
        console.error('Ошибка при чтении data.json:', error);

        await bot.sendMessage(chatId, 'Ошибка при чтении файла data.json.');
    }
}

// Функция для отправки содержимого dataLinkTwo.
async function sendDataJsonLinkTwo(chatId) {
    try 
    {
        const indexContent = fs.readFileSync('dataBase/dataLinkTwo.json', 'utf8');

        const indexData = JSON.parse(indexContent);

        const message = Object.values(indexData).join('\n'); 

        await bot.sendMessage(chatId, message);
    } 
    
    catch (error) 
    {
        console.error('Ошибка при чтении index.json:', error);

        await bot.sendMessage(chatId, 'Ошибка при чтении файла index.json.');
    }
}


//Тело команд.

bot.onText("/save (.+)", (msg, match) => 
{ 

    const userId = msg.from.id;

    const chatId = msg.chat.id;

    const dataToSave = match[1]; 

    const data = readData(); 

    const key = Date.now(); 

    data[key] = dataToSave;  

    writeData(data); 

    bot.sendMessage(chatId, `Данные сохранены под ключом ${key}`);
});

// Обработчик команды /show.
bot.onText("/show (.+)", (msg, match) => 
{

    const chatId = msg.chat.id;

    const keyToShow = match[1]; 

    // Читаем существующие данные
    const data = readData();

    if (data[keyToShow]) 
    {

        bot.sendMessage(chatId, `Данные под ключом ${keyToShow}: ${data[keyToShow]}`);

    } 

    else

    {

    bot.sendMessage(chatId, `Данные под ключом ${keyToShow} не найдены.`);

    }
});

bot.onText("/list", (msg) => // Обработчик команды /list.
{

  const chatId = msg.chat.id;

  const userId = msg.from.id;

    if (userId !== authorizedUserId) // Проврерка на администратора.
    {

        bot.sendMessage(chatId, 'У вас нет прав на выполнение этой команды.');

        return;
    }

  const data = readData(); // Читаем существующие данные.

  let message = "Список сохраненных данных:\n";

    for (const key in data) 
    {

        message += `${key}: ${data[key]}\n`;

    }

    bot.sendMessage(chatId, message.length > 25 ? message : "Нет сохраненных данных.");
});

// Тело проекта

// Обработчик для всех текстовых сообщений.
bot.on('message', (msg) => {

    const chatId = msg.chat.id;

    const text = msg.text;

    const username = msg.from.username || 'Unknown';

    // Формируем строку сообщения
    const messageEntry = `[${new Date().toISOString()}] ${username}: ${text}\n`;

    // Записываем сообщение в файл
    fs.appendFile(messagesFilePath, messageEntry, (err) => 
        {
        if (err) 
        {

            console.error('Ошибка при записи в файл:', err);

        }

        else 
        {

            console.log('Сообщение успешно записано в файл');

        }
    });

    // Отправляем подтверждение пользователю.
});

bot.on('text', async msg => {


    try 
    {

        if(msg.text == '/start') // Надо переписать под json если хотите что бы работа лучше, но мне лень.
        {

            await bot.sendMessage(msg.chat.id, `Привет Хозяин, бот запущен, что продолжить напишите /help`);

        }

        else if(msg.text == '/help') {
            await bot.sendMessage(msg.chat.id,
                'В данном разделе показываются ссылки которые ведут на п.о для скачивания всякого рода контента: \n' + 
                '/link_1 - ведет для скачивания файлов с рутрекера и других источников, подробнее доступно по ссылке\n' +
                '/link_2 ведет для скачивания разного рода опереционных систем подробнее доступно по ссылке\n' +
                '/link_3 - чат со мной и ряботягами тех кто реально хочет пообщать на разные темы и всякое такое - подробнее доступно по ссылке.\n' +
                '/save пробел и тут вы пишите свой текст. Данная команда возможность вам добавить свои идеи, я их рассмотрю, и если что-то покажется интересным то я добавлю \n' +
                'Так же хочу обратить ваше внимание, создатель не несет ответственности за ваше оборудование, вы скачиваете все п.о на ваш страх и риск, данный контент находящийся здесь несет только информативную цель, всем спасибо за внимание.'
            );
        }

        else if(msg.text == '/link_1') //Блок команд link.
        {

            const chatId = msg.chat.id;

            sendDataJsonLinkOne(chatId);

            disable_web_page_preview: false,

            await bot.sendVideo(msg.chat.id, './/Link1.mp4' );
            
        }

        else if(msg.text == '/link_2')    
        {   
            disable_web_page_preview: false;

            const chatId = msg.chat.id;

            sendDataJsonLinkTwo(chatId);
        }

        else if(msg.text == '/link_3') 
        {

            await bot.sendMessage(msg.chat.id,`Упс пока не раализованно.`)

        }

        else 
        {
            await bot.sendMessage(msg.chat.id, 'Извините не понял ваш запрос, за просмотром команд напишите /help')
        }
    }

    catch(error) 
    { 

        console.log(error);

    }
})

// Блок с массивом команд.

const commands = [

    {

        command: "start",
        description: "Запуск бота"

    },
    {

        command: "link_1",
        description: "Программки для виндовс"

    },
    {

        command: "link_2",
        description: "Опереционные системы ",


    },
    {

        command: "link_3",
        description: "Пока еще не сделал, чутка попзже сделаем чатик.",


    },
    {

        command: "help",
        description: "Помощь по ссылкам"

    },
    {

        command: "save",
        description: "Данная команда нужна для предложений, грубо говоря вы пишите /save тут текст, что вы хотите добавить или что хотите изменить."

    }
    
]

bot.setMyCommands(commands);

//Логи.

console.log("Бот запущен.");