const express = require('express');
const app = express();
const mysql = require('mysql');
const multer = require('multer')
const path = require('path')
const cors = require('cors');
app.use(cors());
app.use(express.static("./public"))
app.use(express.json()); 



var Client = require('ftp');
var c = new Client();


const db = mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'',
    database:'theos_website'
})


var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        //console.log(req)
        callBack(null, file.originalname)
    }
})

var storage_MS1A = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/MS1A/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        // console.log(req)
        callBack(null, file.originalname)
    }
})

var storage_MS2A = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/MS2A/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        //console.log(req)
        callBack(null, file.originalname)
    }
})

var storage_PAN1A = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/PAN1A/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        //console.log(req)
        callBack(null, file.originalname)
    }
})
var storage_PAN2A = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/PAN2A/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        console.log(req.file)
        callBack(null, file.originalname)
    }
})


var upload = multer({
    storage: storage
});

var upload_MS1A = multer({
    storage: storage_MS1A
});
var upload_MS2A = multer({
    storage: storage_MS2A
});
var upload_PAN1A = multer({
    storage: storage_PAN1A
});
var upload_PAN2A = multer({
    storage: storage_PAN2A
});






app.post("/ADD_IMAGE_IN_FTP_SERVER", (req, res) => {

    c.connect({
        host:'127.0.0.1',
        port:21,
        user:'Test',
        password:'080836'
    });

    var all_file = req.body.allfile;
    //var FULLPATH = req.body.FULLPATH;
    var customername = req.body.customername
    var d = new Date()
    var this_Date = d.getDate()+'_'+(d.getMonth()+1)+'_'+d.getFullYear()
    var p_customer = '/'+customername+'/'+this_Date+'/'

    //console.log(all_file);

    c.on('ready', function() {
        c.mkdir(p_customer,1,function(err){
            if(err){
            console.log(err);
            }else{
                all_file.forEach(file=>{
                    // var image_url = file.PRODUCT_IMAGE.split("/")
                    // var image_path = 'public/'+image_url[3]+'/'+image_url[4];
                    var file_path = file.FULLPATH+'/'+file.SOURCE
                    console.log(file_path);
                    // console.log(image_url[4])
                    c.put(file_path, p_customer+file.SOURCE, function(err) {
                        if (err) throw err;
                    });
                })
            }
        })
        



        c.end();
    });
    res.send('CAN DO IT');
   
});


app.post('/Add_history',(req,res)=>{
    var History_Date= req.body.History_Date;
    var History_Time= req.body.History_Time;
    var employee = req.body.employee;
    var SUMMARY_IMAGE = req.body.SUMMARY_IMAGE;
    var SUMMARY_EMAIL = req.body.SUMMARY_EMAIL;
    var allEmail = req.body.allEmail;
    var customer = req.body.customer;
    db.query("INSERT INTO `order_theos`(`Date`, `Time`, `Employee`, `SUMMARY_IMAGE`, `SUMMARY_EMAIL`) VALUES "+
    "(?,?,?,?,?)",[History_Date,History_Time,employee,SUMMARY_IMAGE,SUMMARY_EMAIL],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            // console.log(result)
            // res.send(result)
            req.body.cart.forEach((image)=>{
                db.query("INSERT INTO `image_order`(`ID_ORDER`, `DATE`, `TIME`, `MISSION`, `REVOLUTION_NUMBER`, `INSTRUMENT_TYPE`,"+
                " `INSTRUMENT_INDEX`, `PATH`, `ROW`, `SUN_AZIMUTH`, `SUN_ELEVATION`,"+
                " `NW_LAT`, `NW_LON`, `NE_LAT`, `NE_LON`, `SW_LAT`, `SW_LON`, `SE_LAT`, `SE_LON`, `CENTER_LAT`, `CENTER_LON`,"+
                " `MODE`, `LEVEL`, `IMAGE_MODE_ID`, `IMAGE_PATH`) VALUES "+
                "(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[
                    result.insertId,image.DATE,image.TIME,image.MISSION,image.REVOLUTION_NUMBER,image.INSTRUMENT_TYPE,
                    image.INSTRUMENT_INDEX,image.PATH,image.ROW,image.SUN_AZIMUTH,image.SUN_ELEVATION,
                    image.NW_LAT,image.NW_LON,image.NE_LAT,image.NE_LON,image.SW_LAT,image.SW_LON,image.SE_LAT,image.SE_LON,image.CENTER_LAT,image.CENTER_LON,
                    image.MODE,image.LEVEL,image.IMAGE_ID,image.PRODUCT_IMAGE],(err,result)=>{
                    if(err){
                        console.log(err);
                    }else{
                    }
                })
            })
            allEmail.forEach((email)=>{
                db.query("INSERT INTO `history_email`(`ID_order`, `email`) VALUES (?,?)",
                [result.insertId,email],(err,result)=>{
                    if(err){
                        console.log(err);
                    }else{
                    }
                })
            })

            db.query("INSERT INTO `customer_order`(`ID_order`, `ID_employee`, `Name`, `FTP`, `Username`, `Password`, `Email`) VALUES (?,?,?,?,?,?,?)",
            [result.insertId,customer.customer_id,customer.name,customer.FTP,customer.username,customer.password,customer.email],(err,result)=>{
                    if(err){
                        console.log(err);
                    }else{
                    }
            })
            res.send('Add histomrysuccesss')
        }
    })
})

app.get('/get_SOURCE_PATH/:id_image/:level',(req,res)=>{
    const id_image = req.params.id_image;
    const level = req.params.level.toLowerCase();
    console.log(id_image);
    console.log(level);
    db.query("SELECT SOURCE,FULLPATH FROM "+level+" WHERE ID = ?",[id_image],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})


app.get('/user/:username/:password',(req,res)=>{
    const username = req.params.username;
    const password = req.params.password;
    db.query("SELECt * FROM user WHERE username = ? AND password_user = ?",[username,password],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})



app.get('/user/:username/:password',(req,res)=>{
    const username = req.params.username;
    const password = req.params.password;
    db.query("SELECt * FROM user WHERE username = ? AND password_user = ?",[username,password],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})
app.get('/userNavbar/:username/:first_name/:last_name/:email',(req,res)=>{
    const username = req.params.username;
    const first_name = req.params.first_name;
    const last_name = req.params.last_name;
    const email = req.params.email;
    db.query("SELECt * FROM user WHERE username = ? AND first_name = ? AND last_name = ? AND email = ?",[username,first_name,last_name,email],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})
app.get('/checkuser/:username/:email',(req,res)=>{
    const username = req.params.username;
    const email = req.params.email;
    db.query("SELECt * FROM user WHERE username = ? OR email = ?",[username,email],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})

app.post('/create_user',(req,res)=>{
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const status = 'user';
    //console.log(firstname)
    db.query("INSERT INTO user( first_name,last_name,username,email,password_user,status_user) VALUES (?,?,?,?,?,?)",
    [firstname,lastname,username,email,password,status],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send('Add_success')
        }
    })
})
app.get('/getDetailHistoryImage/:ID',(req,res)=>{
    var id = req.params.ID;
    db.query("SELECT * FROM `image_order` WHERE ID_ORDER = ? ",[id],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})

app.get('/getAllEmail/:ID',(req,res)=>{
    var id = req.params.ID;
    db.query("SELECT * FROM `history_email` WHERE ID_ORDER = ? ",[id],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})

app.get('/getDetailHistoryCustomer/:ID',(req,res)=>{
    var id = req.params.ID;
    db.query("SELECT * FROM `customer_order` WHERE ID_order = ? ",[id],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})

app.get('/getHistory/:condition',(req,res)=>{

    var condition = 'WHERE'+ req.params.condition.slice(4);
    
    if(req.params.condition ==='-'){
        condition = ''
    }
    
    db.query("SELECT * FROM `order_theos` "+condition,[],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})

app.get('/getDataForExport/:condition',(req,res)=>{
    var condition =''
    if(req.params.condition ==='-'){
        condition = ''
    }else{
        condition = 'WHERE '+ req.params.condition.slice(5);
    }
    
    console.log(condition)
    
    
    db.query("SELECT order_theos.ID_order as ID_ORDER ,order_theos.Date as ORDER_DATE ,order_theos.Time as ORDER_TIME"+
    " , order_theos.Employee as By_EMPLOYEE , image_order.id as IMAGE_ID , image_order.REVOLUTION_NUMBER as REVOLUTION_NUMBER "+
    " , image_order.DATE as INAGE_DATE,image_order.TIME as IMAGE_TIME,image_order.MISSION as MISSION, "+
    "customer_order.Name as CUSTOMER_NAME,history_email.email as EMAIL FROM order_theos LEFT JOIN image_order"+
    " ON order_theos.ID_order = image_order.ID_ORDER "+
     "LEFT JOIN customer_order ON order_theos.ID_order = customer_order.ID_order LEFT JOIN history_email ON "+
     " history_email.ID_order = customer_order.ID_order"+condition,[],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})



app.get('/getcustomer/:nameword',(req,res)=>{
    var nameword = req.params.nameword;
    if(req.params.nameword ==='-'){
        nameword = ''
    }
    db.query("SELECT * FROM customer WHERE NAME LIKE '"+nameword+"%' ",[],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})

app.post('/create_customer',(req,res)=>{
    const name = req.body.this_customer.name
    const email = req.body.this_customer.email
    const FTP = req.body.this_customer.FTP
    const username = req.body.this_customer.username
    const password = req.body.this_customer.password
    const customer_description = req.body.this_customer.customer_description
    db.query("INSERT INTO customer( NAME,EMAIL,DESCRIPTION,FTP,USERNAME,PASSWORD) VALUES (?,?,?,?,?,?)",
    [name,email,FTP,username,password,customer_description],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send('Add_success')
        }
    })
})



app.post('/add_data_cuffile/',(req,res)=>{
    const misstion=req.body.misstion;
    const revolutionNumber=req.body.revolutionNumber;
    const date=req.body.date;
    const time=req.body.time;
    const instrumentType=req.body.instrumentType;
    const instrumentIdt=req.body.instrumentIdt;
    const spectralMode=req.body.spectralMode;
    const path=req.body.path;
    const row=req.body.row;
    const sunAzimuth=req.body.sunAzimuth;
    const sunElevation=req.body.sunElevation;
    const nwLat=req.body.nwLat;
    const nwLon=req.body.nwLon;
    const neLat=req.body.neLat;
    const neLon=req.body.neLon;
    const swLat=req.body.swLat;
    const swLon=req.body.swLon;
    const seLat=req.body.seLat;
    const seLon=req.body.seLon;
    const latSceneCenter=req.body.latSceneCenter;
    const longSceneCenter=req.body.longSceneCenter;
    var image;
    const browseBeginLine=req.body.browseBeginLine;
    const browseEndLine=req.body.browseEndLine;
    

    var moderaw;
    if (spectralMode ==='MS'){
        moderaw = 'MSRAWIMAGE'
        image = 'http://127.0.0.1:3001/images/' +req.body.image;
    }else if(spectralMode === 'PAN'){
        moderaw = 'PANRAWIMAGE'
        image =  'http://127.0.0.1:3001/images/'+req.body.image;
    }
    //console.log(firstname)
    db.query("INSERT INTO all_image_order (DATE,TIME,MISSION,REVOLUTION_NUMBER,INSTRUMENT_TYPE,INSTRUMENT_INDEX,"+
    "MODE,PATH,ROW,SUN_AZIMUTH,SUN_ELEVATION,BROWSEBEGINLINE,BROWSEENDLINE,"+
    "NW_LAT,NW_LON,NE_LAT,NE_LON,SW_LAT,SW_LON,SE_LAT,SE_LON,CENTER_LAT,CENTER_LON,"+moderaw+
    ") SELECT * FROM (SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) AS Tmp "+
    "WHERE NOT EXISTS (SELECT DATE,TIME,MISSION,REVOLUTION_NUMBER,MODE,PATH,ROW,INSTRUMENT_TYPE,INSTRUMENT_INDEX FROM all_image_order WHERE DATE = ? AND TIME = ? AND MISSION = ? AND REVOLUTION_NUMBER = ?"+
    " AND MODE = ? AND PATH = ? AND ROW = ? AND INSTRUMENT_TYPE = ? AND INSTRUMENT_INDEX = ?)LIMIT 1 "
    ,
    [date,time,misstion,revolutionNumber,instrumentType,instrumentIdt,
        spectralMode,path,row,sunAzimuth,sunElevation,browseBeginLine,browseEndLine,nwLat,nwLon,neLat,
        neLon,swLat,swLon,seLat,seLon,latSceneCenter,longSceneCenter,image,date,time,
        misstion,revolutionNumber,spectralMode,path,row,instrumentType,instrumentIdt],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send('Add_success')
        }
    })
})




app.get('/imagedata/',(req,res)=>{
    
    db.query("SELECT * FROM all_image_order ORDER BY ID DESC LIMIT 0, 50",
    [],
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})

app.get('/geturlimage/:tablename/:id',(req,res)=>{
    var table_name = req.params.tablename;
    var id = req.params.id;
    db.query("SELECT ID,IMAGE FROM ? WHERE ID = ?",
    [table_name,id],
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})

app.get('/imagedata_with_option/:option/:page',(req,res)=>{
    var option;
    if(req.params.option === '-'){
        option = ''
        // console.log(option)
    }else{
        option = "WHERE"+req.params.option.slice(4)
        // console.log(option)
    }
    var page = (parseInt(req.params.page)-1)*50
    db.query("SELECT * FROM all_image_order "+option+" ORDER BY ID DESC LIMIT "+page+", 50",
    [],
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})









app.get('/get_id_allfile/:IMAGING_DATE/:time/:MISSION/:REVOLUTION_NUMBER/:INSTRUMENT/'+
':INSTRUMENT_INDEX/:IMAGING_MODE/:PATH/:ROW',(req,res)=>{

    var IMAGING_DATE =req.params.IMAGING_DATE;
    var TIME = req.params.time;
    var MISSION =req.params.MISSION;
    var REVOLUTION_NUMBER = req.params.REVOLUTION_NUMBER;
    var INSTRUMENT = req.params.INSTRUMENT;
    var INSTRUMENT_INDEX = req.params.INSTRUMENT_INDEX;
    var IMAGING_MODE = req.params.IMAGING_MODE;
    var PATH = req.params.PATH;
    var ROW = req.params.ROW;

    db.query("SELECt * FROM  all_image_order WHERE DATE = ? AND TIME = ? AND MISSION = ? AND REVOLUTION_NUMBER = ? "+
            " AND MODE = ? "
            ,[IMAGING_DATE,TIME,MISSION,REVOLUTION_NUMBER,IMAGING_MODE],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            //console.log(result);
            res.send(result)
        }
    })
})

app.put('/update_mode/',(req,res)=>{
    var ID_in_order = req.body.ID_in_order;
    var insertId = req.body.insertId;
    var mode = req.body.mode;
    var image  = req.body.image;
    var choice = '';
    var col_image = '';
    if(mode === 'ms1a'){
        choice = 'MS1A_ID'
        col_image  = 'MS1AIMAGE'
    }else if(mode === 'ms2a'){
        choice = 'MS2A_ID'
        col_image  = 'MS2AIMAGE'
    }else if(mode === 'pan1a'){
        choice = 'PAN1A_ID'
        col_image  = 'PAN1AIMAGE'
    }else if(mode === 'pan2a'){
        choice = 'PAN2A_ID'
        col_image  = 'PAN2AIMAGE'
    }

    db.query("UPDATE all_image_order SET "+choice+"= "+insertId+","+col_image+"= '"+image+"' WHERE ID ="+ID_in_order
            ,[],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            //console.log(result);
            console.log('update success');
            res.send(result)
        }
    })
})


app.post("/upload", upload.array('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        // console.log(req.file.filename)
        // var imgsrc = 'http://127.0.0.1:3001/images/' + req.file.filename
        // var insertData = "INSERT INTO test(file_src)VALUES(?)"
        // db.query(insertData, [imgsrc], (err, result) => {
        //     if (err) console.log(err)
        //     console.log("file uploaded")
        // })
    }
});


app.post("/upload_MS1A", upload_MS1A.array('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {

    }
});

app.post("/upload_MS2A", upload_MS2A.array('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {

    }
});

app.post("/upload_PAN1A", upload_PAN1A.array('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        
    }
});
app.post("/upload_PAN2A", upload_PAN2A.array('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        
    }
});





app.post('/add_data/',(req,res)=>{
    const data = req.body.data;
    // SOURCE
    // FULLPATH     
    if(data.PROCESSING_LEVEL === '1A'){
        if(data.IMAGING_MODE == 'MS'){
            db.query("INSERT INTO ms1a(SCENE, SCENE_DISPLAY, SOURCE, FULLPATH,"+
                "DATASET_NAME, PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION,"+
                "GRID_REFERENCE, SHIFT_VALUE, IMAGING_DATE, IMAGING_TIME, MISSION,"+
                "MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE,"+
                "SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK,"+
                "SATELLITE_INCIDENCE_ANGLE, SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION,"+
                "REVOLUTION_NUMBER, THEORETICAL_RESOLUTION, GEO_TABLES, HORIZONTAL_CS_TYPE,"+
                "HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN, JOB_ID,"+
                "PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL,"+
                "DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER,"+
                "NCOLS, NROWS, NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT,"+
                "PROCESSING_LEVEL, GEOMETRIC_PROCESSING, RADIOMETRIC_PROCESSING, ALGORITHM_TYPE,"+
                "ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION, DATA_FILE_FORMAT,"+
                "DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO,"+
                "BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END,"+
                "REFERENCE_BAND, REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE,"+
                "YAW, PITCH, ROLL, CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME,"+
                "TIE_POINT_CRS_X1, TIE_POINT_CRS_Y1, TIE_POINT_DATA_X1, TIE_POINT_DATA_Y1,"+
                "TIE_POINT_CRS_X2, TIE_POINT_CRS_Y2, TIE_POINT_DATA_X2, TIE_POINT_DATA_Y2,"+
                "TIE_POINT_CRS_X3, TIE_POINT_CRS_Y3, TIE_POINT_DATA_X3, TIE_POINT_DATA_Y3,"+
                "TIE_POINT_CRS_X4, TIE_POINT_CRS_Y4, TIE_POINT_DATA_X4, TIE_POINT_DATA_Y4,"+
                "LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,"+
                "LINE_NUMBER_2, GAIN_NUMBER_2, PHYSICAL_BIAS_2, PHYSICAL_GAIN_2, PHYSICAL_UNIT_2,"+
                "LINE_NUMBER_3, GAIN_NUMBER_3, PHYSICAL_BIAS_3, PHYSICAL_GAIN_3, PHYSICAL_UNIT_3,"+
                "LINE_NUMBER_4, GAIN_NUMBER_4, PHYSICAL_BIAS_4, PHYSICAL_GAIN_4, PHYSICAL_UNIT_4,IMAGE"+
                ")VALUES ("+
                "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"+
                "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"+
                "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                    data.SCENE, data.SCENE_DISPLAY, data.SOURCE, data.FULLPATH,
                    data.DATASET_NAME, data.PROLINE_NAME, data.SOURCE_TYPE, data.SOURCE_ID, data.SOURCE_DESCRIPTION,
                    data.GRID_REFERENCE, data.SHIFT_VALUE, data.IMAGING_DATE, data.IMAGING_TIME, data.MISSION,
                    data.MISSION_INDEX, data.INSTRUMENT, data.INSTRUMENT_INDEX, data.IMAGING_MODE,
                    data.SCENE_PROCESSING_LEVEL, data.VIEWING_ANGLE_ALONG_TRACK, data.VIEWING_ANGLE_ACROSS_TRACK,
                    data.SATELLITE_INCIDENCE_ANGLE, data.SATELLITE_AZIMUTH_ANGLE, data.SUN_AZIMUTH, data.SUN_ELEVATION,
                    data.REVOLUTION_NUMBER, data.THEORETICAL_RESOLUTION, data.GEO_TABLES, data.HORIZONTAL_CS_TYPE,
                    data.HORIZONTAL_CS_CODE, data.HORIZONTAL_CS_NAME, data.RASTER_CS_TYPE, data.PIXEL_ORIGIN, data.JOB_ID,
                    data.PRODUCT_INFO, data.PRODUCT_TYPE, data.DATASET_PRODUCER_NAME, data.DATASET_PRODUCER_URL,
                    data.DATASET_PRODUCTION_DATE, data.SOFTWARE_NAME, data.SOFTWARE_VERSION, data.PROCESSING_CENTER,
                    data.NCOLS, data.NROWS, data.NBANDS, data.NBITS, data.DATA_TYPE, data.BYTEORDER, data.BANDS_LAYOUT,
                    data.PROCESSING_LEVEL, data.GEOMETRIC_PROCESSING, data.RADIOMETRIC_PROCESSING, data.ALGORITHM_TYPE,
                    data.ALGORITHM_NAME, data.ALGORITHM_ACTIVATION, data.DATA_FILE_ORGANISATION, data.DATA_FILE_FORMAT,
                    data.DATA_FILE_PATH, data.DATA_STRIP_ID, data.LCNT, data.IGPST, data.FILE_NAME, data.COMPRESSION_RATIO,
                    data.BAND_INDEX, data.BAND_OFFSET, data.SFSC_BEGIN, data.SFSC_END, data.DSR_BEGIN, data.DSR_END,
                    data.REFERENCE_BAND, data.REFERENCE_TIME, data.REFERENCE_LINE, data.LINE_PERIOD, data.SATELLITE_ALTITUDE,
                    data.YAW, data.PITCH, data.ROLL, data.CALIBRATION_TYPE, data.CALIBRATION_VALIDITY, data.CALIBRATION_FILENAME,
                    data.TIE_POINT_CRS_X1, data.TIE_POINT_CRS_Y1, data.TIE_POINT_DATA_X1, data.TIE_POINT_DATA_Y1,
                    data.TIE_POINT_CRS_X2, data.TIE_POINT_CRS_Y2, data.TIE_POINT_DATA_X2, data.TIE_POINT_DATA_Y2,
                    data.TIE_POINT_CRS_X3, data.TIE_POINT_CRS_Y3, data.TIE_POINT_DATA_X3, data.TIE_POINT_DATA_Y3,
                    data.TIE_POINT_CRS_X4, data.TIE_POINT_CRS_Y4, data.TIE_POINT_DATA_X4, data.TIE_POINT_DATA_Y4,
                    data.LINE_NUMBER_1, data.GAIN_NUMBER_1, data.PHYSICAL_BIAS_1, data.PHYSICAL_GAIN_1, data.PHYSICAL_UNIT_1,
                    data.LINE_NUMBER_2, data.GAIN_NUMBER_2, data.PHYSICAL_BIAS_2, data.PHYSICAL_GAIN_2, data.PHYSICAL_UNIT_2,
                    data.LINE_NUMBER_3, data.GAIN_NUMBER_3, data.PHYSICAL_BIAS_3, data.PHYSICAL_GAIN_3, data.PHYSICAL_UNIT_3,
                    data.LINE_NUMBER_4, data.GAIN_NUMBER_4, data.PHYSICAL_BIAS_4, data.PHYSICAL_GAIN_4, data.PHYSICAL_UNIT_4,
                    data.IMAGE

                ],
                (err,result)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.send(result)
                    }
            })
        }else if(data.IMAGING_MODE == 'PAN'){
            db.query("INSERT INTO pan1a(SCENE, SCENE_DISPLAY, SOURCE, FULLPATH,"+
                "DATASET_NAME, PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION,"+
                "GRID_REFERENCE, SHIFT_VALUE, IMAGING_DATE, IMAGING_TIME, MISSION,"+
                "MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE,"+
                "SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK,"+
                "SATELLITE_INCIDENCE_ANGLE, SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION,"+
                "REVOLUTION_NUMBER, THEORETICAL_RESOLUTION, GEO_TABLES, HORIZONTAL_CS_TYPE,"+
                "HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN, JOB_ID,"+
                "PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL,"+
                "DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER,"+
                "NCOLS, NROWS, NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT,"+
                "PROCESSING_LEVEL, GEOMETRIC_PROCESSING, RADIOMETRIC_PROCESSING, ALGORITHM_TYPE,"+
                "ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION, DATA_FILE_FORMAT,"+
                "DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO,"+
                "BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END,"+
                "REFERENCE_BAND, REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE,"+
                "YAW, PITCH, ROLL, CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME,"+
                "TIE_POINT_CRS_X1, TIE_POINT_CRS_Y1, TIE_POINT_DATA_X1, TIE_POINT_DATA_Y1,"+
                "TIE_POINT_CRS_X2, TIE_POINT_CRS_Y2, TIE_POINT_DATA_X2, TIE_POINT_DATA_Y2,"+
                "TIE_POINT_CRS_X3, TIE_POINT_CRS_Y3, TIE_POINT_DATA_X3, TIE_POINT_DATA_Y3,"+
                "TIE_POINT_CRS_X4, TIE_POINT_CRS_Y4, TIE_POINT_DATA_X4, TIE_POINT_DATA_Y4,"+
                "LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,IMAGE"+
                ")VALUES ("+
                "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"+
                "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"+
                "?,?)",
                [
                    data.SCENE, data.SCENE_DISPLAY, data.SOURCE, data.FULLPATH,
                    data.DATASET_NAME, data.PROLINE_NAME, data.SOURCE_TYPE, data.SOURCE_ID, data.SOURCE_DESCRIPTION,
                    data.GRID_REFERENCE, data.SHIFT_VALUE, data.IMAGING_DATE, data.IMAGING_TIME, data.MISSION,
                    data.MISSION_INDEX, data.INSTRUMENT, data.INSTRUMENT_INDEX, data.IMAGING_MODE,
                    data.SCENE_PROCESSING_LEVEL, data.VIEWING_ANGLE_ALONG_TRACK, data.VIEWING_ANGLE_ACROSS_TRACK,
                    data.SATELLITE_INCIDENCE_ANGLE, data.SATELLITE_AZIMUTH_ANGLE, data.SUN_AZIMUTH, data.SUN_ELEVATION,
                    data.REVOLUTION_NUMBER, data.THEORETICAL_RESOLUTION, data.GEO_TABLES, data.HORIZONTAL_CS_TYPE,
                    data.HORIZONTAL_CS_CODE, data.HORIZONTAL_CS_NAME, data.RASTER_CS_TYPE, data.PIXEL_ORIGIN, data.JOB_ID,
                    data.PRODUCT_INFO, data.PRODUCT_TYPE, data.DATASET_PRODUCER_NAME, data.DATASET_PRODUCER_URL,
                    data.DATASET_PRODUCTION_DATE, data.SOFTWARE_NAME, data.SOFTWARE_VERSION, data.PROCESSING_CENTER,
                    data.NCOLS, data.NROWS, data.NBANDS, data.NBITS, data.DATA_TYPE, data.BYTEORDER, data.BANDS_LAYOUT,
                    data.PROCESSING_LEVEL, data.GEOMETRIC_PROCESSING, data.RADIOMETRIC_PROCESSING, data.ALGORITHM_TYPE,
                    data.ALGORITHM_NAME, data.ALGORITHM_ACTIVATION, data.DATA_FILE_ORGANISATION, data.DATA_FILE_FORMAT,
                    data.DATA_FILE_PATH, data.DATA_STRIP_ID, data.LCNT, data.IGPST, data.FILE_NAME, data.COMPRESSION_RATIO,
                    data.BAND_INDEX, data.BAND_OFFSET, data.SFSC_BEGIN, data.SFSC_END, data.DSR_BEGIN, data.DSR_END,
                    data.REFERENCE_BAND, data.REFERENCE_TIME, data.REFERENCE_LINE, data.LINE_PERIOD, data.SATELLITE_ALTITUDE,
                    data.YAW, data.PITCH, data.ROLL, data.CALIBRATION_TYPE, data.CALIBRATION_VALIDITY, data.CALIBRATION_FILENAME,
                    data.TIE_POINT_CRS_X1, data.TIE_POINT_CRS_Y1, data.TIE_POINT_DATA_X1, data.TIE_POINT_DATA_Y1,
                    data.TIE_POINT_CRS_X2, data.TIE_POINT_CRS_Y2, data.TIE_POINT_DATA_X2, data.TIE_POINT_DATA_Y2,
                    data.TIE_POINT_CRS_X3, data.TIE_POINT_CRS_Y3, data.TIE_POINT_DATA_X3, data.TIE_POINT_DATA_Y3,
                    data.TIE_POINT_CRS_X4, data.TIE_POINT_CRS_Y4, data.TIE_POINT_DATA_X4, data.TIE_POINT_DATA_Y4,
                    data.LINE_NUMBER_1, data.GAIN_NUMBER_1, data.PHYSICAL_BIAS_1, data.PHYSICAL_GAIN_1, data.PHYSICAL_UNIT_1,
                    data.IMAGE
                ],
                (err,result)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.send(result)
                    }
            })
        }
        
    }
    
    else if(data.PROCESSING_LEVEL === '2A'){
        if(data.IMAGING_MODE == 'MS'){
            db.query("INSERT INTO ms2a( SCENE, SCENE_DISPLAY, SOURCE, FULLPATH, DATASET_NAME,"+
            "PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION, GRID_REFERENCE, SHIFT_VALUE,"+
            "IMAGING_DATE, IMAGING_TIME, MISSION, MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE,"+
            "SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK, SATELLITE_INCIDENCE_ANGLE,"+
            "SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION, REVOLUTION_NUMBER, THEORETICAL_RESOLUTION,"+
            "GEO_TABLES, HORIZONTAL_CS_TYPE, HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN,"+
            "JOB_ID, PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL,"+
            "DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER, NCOLS, NROWS,"+
            "NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT, PROCESSING_LEVEL, GEOMETRIC_PROCESSING,"+
            "RADIOMETRIC_PROCESSING, ALGORITHM_TYPE, ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION,"+
            "DATA_FILE_FORMAT, DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO,"+
            "BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END, REFERENCE_BAND,"+
            "REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE, YAW, PITCH, ROLL,"+
            "CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME, ULXMAP, ULYMAP, XDIM,"+
            "YDIM, LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,"+
            "LINE_NUMBER_2, GAIN_NUMBER_2, PHYSICAL_BIAS_2, PHYSICAL_GAIN_2, PHYSICAL_UNIT_2,"+
            "LINE_NUMBER_3, GAIN_NUMBER_3, PHYSICAL_BIAS_3, PHYSICAL_GAIN_3, PHYSICAL_UNIT_3,"+
            "LINE_NUMBER_4, GAIN_NUMBER_4, PHYSICAL_BIAS_4, PHYSICAL_GAIN_4, PHYSICAL_UNIT_4,IMAGE"+
            ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"+
                    "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                ,[
                    data.SCENE, data.SCENE_DISPLAY, data.SOURCE, data.FULLPATH, data.DATASET_NAME,
                    data.PROLINE_NAME, data.SOURCE_TYPE, data.SOURCE_ID, data.SOURCE_DESCRIPTION, data.GRID_REFERENCE, data.SHIFT_VALUE,
                    data.IMAGING_DATE, data.IMAGING_TIME, data.MISSION, data.MISSION_INDEX, data.INSTRUMENT, data.INSTRUMENT_INDEX, data.IMAGING_MODE,
                    data.SCENE_PROCESSING_LEVEL, data.VIEWING_ANGLE_ALONG_TRACK, data.VIEWING_ANGLE_ACROSS_TRACK, data.SATELLITE_INCIDENCE_ANGLE,
                    data.SATELLITE_AZIMUTH_ANGLE, data.SUN_AZIMUTH, data.SUN_ELEVATION, data.REVOLUTION_NUMBER, data.THEORETICAL_RESOLUTION,
                    data.GEO_TABLES, data.HORIZONTAL_CS_TYPE, data.HORIZONTAL_CS_CODE, data.HORIZONTAL_CS_NAME, data.RASTER_CS_TYPE, data.PIXEL_ORIGIN,
                    data.JOB_ID, data.PRODUCT_INFO, data.PRODUCT_TYPE, data.DATASET_PRODUCER_NAME, data.DATASET_PRODUCER_URL,
                    data.DATASET_PRODUCTION_DATE, data.SOFTWARE_NAME, data.SOFTWARE_VERSION, data.PROCESSING_CENTER, data.NCOLS, data.NROWS,
                    data.NBANDS, data.NBITS, data.DATA_TYPE, data.BYTEORDER, data.BANDS_LAYOUT, data.PROCESSING_LEVEL, data.GEOMETRIC_PROCESSING,
                    data.RADIOMETRIC_PROCESSING, data.ALGORITHM_TYPE, data.ALGORITHM_NAME, data.ALGORITHM_ACTIVATION, data.DATA_FILE_ORGANISATION,
                    data.DATA_FILE_FORMAT, data.DATA_FILE_PATH, data.DATA_STRIP_ID, data.LCNT, data.IGPST, data.FILE_NAME, data.COMPRESSION_RATIO,
                    data.BAND_INDEX, data.BAND_OFFSET, data.SFSC_BEGIN, data.SFSC_END, data.DSR_BEGIN, data.DSR_END, data.REFERENCE_BAND,
                    data.REFERENCE_TIME, data.REFERENCE_LINE, data.LINE_PERIOD, data.SATELLITE_ALTITUDE, data.YAW, data.PITCH, data.ROLL,
                    data.CALIBRATION_TYPE, data.CALIBRATION_VALIDITY, data.CALIBRATION_FILENAME, data.ULXMAP, data.ULYMAP, data.XDIM,
                    data.YDIM, data.LINE_NUMBER_1, data.GAIN_NUMBER_1, data.PHYSICAL_BIAS_1, data.PHYSICAL_GAIN_1, data.PHYSICAL_UNIT_1,
                    data.LINE_NUMBER_2, data.GAIN_NUMBER_2, data.PHYSICAL_BIAS_2, data.PHYSICAL_GAIN_2, data.PHYSICAL_UNIT_2,
                    data.LINE_NUMBER_3, data.GAIN_NUMBER_3, data.PHYSICAL_BIAS_3, data.PHYSICAL_GAIN_3, data.PHYSICAL_UNIT_3,
                    data.LINE_NUMBER_4, data.GAIN_NUMBER_4, data.PHYSICAL_BIAS_4, data.PHYSICAL_GAIN_4, data.PHYSICAL_UNIT_4,
                    data.IMAGE
                ],
                (err,result)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.send(result)
                    }
            })
        }else if(data.IMAGING_MODE == 'PAN'){
            db.query("INSERT INTO pan2a( SCENE, SCENE_DISPLAY, SOURCE, FULLPATH, DATASET_NAME,"+
            "PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION, GRID_REFERENCE, SHIFT_VALUE,"+
            "IMAGING_DATE, IMAGING_TIME, MISSION, MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE,"+
            "SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK, SATELLITE_INCIDENCE_ANGLE,"+
            "SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION, REVOLUTION_NUMBER, THEORETICAL_RESOLUTION,"+
            "GEO_TABLES, HORIZONTAL_CS_TYPE, HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN,"+
            "JOB_ID, PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL,"+
            "DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER, NCOLS, NROWS,"+
            "NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT, PROCESSING_LEVEL, GEOMETRIC_PROCESSING,"+
            "RADIOMETRIC_PROCESSING, ALGORITHM_TYPE, ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION,"+
            "DATA_FILE_FORMAT, DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO,"+
            "BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END, REFERENCE_BAND,"+
            "REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE, YAW, PITCH, ROLL,"+
            "CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME, ULXMAP, ULYMAP, XDIM,"+
            "YDIM, LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,IMAGE"+

            ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"+
                    "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                ,[
                    data.SCENE, data.SCENE_DISPLAY, data.SOURCE, data.FULLPATH, data.DATASET_NAME,
                    data.PROLINE_NAME, data.SOURCE_TYPE, data.SOURCE_ID, data.SOURCE_DESCRIPTION, data.GRID_REFERENCE, data.SHIFT_VALUE,
                    data.IMAGING_DATE, data.IMAGING_TIME, data.MISSION, data.MISSION_INDEX, data.INSTRUMENT, data.INSTRUMENT_INDEX, data.IMAGING_MODE,
                    data.SCENE_PROCESSING_LEVEL, data.VIEWING_ANGLE_ALONG_TRACK, data.VIEWING_ANGLE_ACROSS_TRACK, data.SATELLITE_INCIDENCE_ANGLE,
                    data.SATELLITE_AZIMUTH_ANGLE, data.SUN_AZIMUTH, data.SUN_ELEVATION, data.REVOLUTION_NUMBER, data.THEORETICAL_RESOLUTION,
                    data.GEO_TABLES, data.HORIZONTAL_CS_TYPE, data.HORIZONTAL_CS_CODE, data.HORIZONTAL_CS_NAME, data.RASTER_CS_TYPE, data.PIXEL_ORIGIN,
                    data.JOB_ID, data.PRODUCT_INFO, data.PRODUCT_TYPE, data.DATASET_PRODUCER_NAME, data.DATASET_PRODUCER_URL,
                    data.DATASET_PRODUCTION_DATE, data.SOFTWARE_NAME, data.SOFTWARE_VERSION, data.PROCESSING_CENTER, data.NCOLS, data.NROWS,
                    data.NBANDS, data.NBITS, data.DATA_TYPE, data.BYTEORDER, data.BANDS_LAYOUT, data.PROCESSING_LEVEL, data.GEOMETRIC_PROCESSING,
                    data.RADIOMETRIC_PROCESSING, data.ALGORITHM_TYPE, data.ALGORITHM_NAME, data.ALGORITHM_ACTIVATION, data.DATA_FILE_ORGANISATION,
                    data.DATA_FILE_FORMAT, data.DATA_FILE_PATH, data.DATA_STRIP_ID, data.LCNT, data.IGPST, data.FILE_NAME, data.COMPRESSION_RATIO,
                    data.BAND_INDEX, data.BAND_OFFSET, data.SFSC_BEGIN, data.SFSC_END, data.DSR_BEGIN, data.DSR_END, data.REFERENCE_BAND,
                    data.REFERENCE_TIME, data.REFERENCE_LINE, data.LINE_PERIOD, data.SATELLITE_ALTITUDE, data.YAW, data.PITCH, data.ROLL,
                    data.CALIBRATION_TYPE, data.CALIBRATION_VALIDITY, data.CALIBRATION_FILENAME, data.ULXMAP, data.ULYMAP, data.XDIM,
                    data.YDIM, data.LINE_NUMBER_1, data.GAIN_NUMBER_1, data.PHYSICAL_BIAS_1, data.PHYSICAL_GAIN_1, data.PHYSICAL_UNIT_1,
                    data.IMAGE
                    
                ],
                (err,result)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.send(result)
                    }
            })
        }
    }
})


const PORT = process.env.PORT || 3001

app.listen(PORT,()=>{
    console.log('Server is running on port 3001')
})