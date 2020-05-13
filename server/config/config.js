//=================
//  Puerto
//=================
process.env.PORT = process.env.PORT || 3000;

mongodb: //mongoDB:<password>@cluster0-3x8fc.mongodb.net/test?retryWrites=true&w=majority

    //=================
    //  Entorno
    //=================

    process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=================
//  Base de Datos
//=================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://mongoDB:WPsaW3snKROP4wvY@cluster0-3x8fc.mongodb.net/test?retryWrites=true&w=majority';
}

process.env.urlDB = urlDB;