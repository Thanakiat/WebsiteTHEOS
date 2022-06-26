
from errno import EXDEV
from tkinter.tix import ROW
import zipfile
from flask import Flask,request,make_response
from flask_mysqldb import MySQL
from zipfile import ZipFile
from werkzeug.utils import secure_filename
import os
import shutil
import xml.etree.ElementTree as ET

app = Flask(__name__)



# uploads_dir = os.path.join(app.instance_path, 'uploads')
# os.makedirs(uploads_dir, exists_ok=True)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'theos_website'

mysql = MySQL(app)

@app.route('/api/upload', methods = ['POST'])
def hello_world():
    
    file = request.files.getlist('file')
    if(os.path.exists('./ziptest')):
        print('True')
    else:
        os.makedirs("./ziptest")
    try:
        for file in request.files.getlist('file'):
            file.save(os.path.join("./ziptest", secure_filename(file.filename)))
        
        for dir,dirname,files in os.walk("./ziptest"):
            # print('dir = ',dir)
            # print('dirname = ',dirname)
            # print('files = ',files)

            for f in files:
                if(f.endswith('.zip')):
                  with ZipFile(dir+'/'+f, 'r') as zip:
                    zip.printdir()
                    for i in zip.namelist():                       
                            
                        if(i.endswith(".CUF")):
                            zip.extract(i)
                            print()
                            print("CUF")
                            tree = ET.parse(i)

                            root = tree.getroot()
                            for j in root:                                 
                                if(j.tag == 'mission'):
                                    print("mission",j.text)
                                    mission = j.text
                                if(j.tag == 'revolutionNumber'):
                                    print('revolutionNumber',j.text)
                                    revolutionNumber = j.text
                                if(j.tag == 'segment'):
                                    for segment in j:
                                        if(segment.tag == 'instrumentType'):
                                            print('instrumentType',segment.text)
                                            instrumentType = segment.text
                                        if(segment.tag == 'instrumentIdt'):
                                            print('instrumentIdt',segment.text)
                                            instrumentIdt = segment.text
                                        if(segment.tag == 'spectralMode'):
                                            print('spectralMode',segment.text)
                                            spectralMode = segment.text                                            
                                            if (spectralMode =='MS'):
                                                moderaw = "MSRAWIMAGE"                                                
                                            elif(spectralMode == 'PAN'):
                                                moderaw = "PANRAWIMAGE"                                           
                                            
                                        if(segment.tag == 'browseSegment'):
                                            for browse in segment:
                                                if(browse.tag == 'browseFileName'):
                                                    print('browseFileName',browse.text)
                                                    browseFileName = browse.text
                                        if(segment.tag == 'scene'):
                                            for scene in segment:

                                                if(scene.tag == 'kPath'):
                                                    print('kPath',scene.text)
                                                    kPath = scene.text
                                                if(scene.tag == 'jRow'):
                                                    print('jRow',scene.text)
                                                    jRow = scene.text
                                                if(scene.tag == 'cloudCover'):
                                                    print('cloudCover',scene.text)
                                                    cloudCover = scene.text
                                                
                                                
                                                if(scene.tag == 'browseBeginLine'):
                                                    print('browseBeginLine',scene.text)
                                                    browseBeginLine = scene.text
                                                if(scene.tag == 'browseEndLine'):
                                                    print('browseEndLine',scene.text)
                                                    browseEndLine =scene.text
                                                if(scene.tag == 'centerViewingDate'):
                                                    print('centerViewingDate',scene.text)
                                                    centerViewingDate = scene.text
                                                    date = centerViewingDate[0:4]+'-'+centerViewingDate[4:6]+'-'+centerViewingDate[6:8]
                                                    hour = centerViewingDate[8:10]
                                                    minite = centerViewingDate[10:12]
                                                    seconds = centerViewingDate[12:14]
                                                    time = hour+':'+minite+':'+ seconds
                                                if(scene.tag == 'latSceneCenter'):
                                                    print('latSceneCenter',scene.text)
                                                    latSceneCenter = scene.text
                                                if(scene.tag == 'longSceneCenter'):
                                                    print('longSceneCenter',scene.text)
                                                    longSceneCenter = scene.text
                                                
                                                if(scene.tag == 'sunAzimuth'):
                                                    print('sunAzimuth',scene.text)
                                                    sunAzimuth = scene.text
                                                if(scene.tag == 'sunElevation'):
                                                    print('sunElevation',scene.text)
                                                    sunElevation = scene.text
                                                if(scene.tag == 'locationScene'):
                                                    for loc in scene:
                                                        if(loc.tag == 'nwLat'):
                                                            print("nwLat : ",loc.text)
                                                            nwLat = loc.text
                                                                                                                        
                                                            if(nwLat[0] == "N"):                                                                                                                            
                                                                nwLat = round((int(nwLat[1:4])+(int(nwLat[4:6])/60)+(int(nwLat[6:])/3600)),3)
                                                            elif(nwLat[0] == "S"):                                                                                                                            
                                                                nwLat = (-1)*round((int(nwLat[1:4])+(int(nwLat[4:6])/60)+(int(nwLat[6:])/3600)),3)
                                                           
                                                        if(loc.tag == 'nwLong'):
                                                            print("nwLong : ",loc.text)
                                                            nwLong = loc.text
                                                            if(nwLong[0] == "E"):                                                                                                                            
                                                                nwLong = round((int(nwLong[1:4])+(int(nwLong[4:6])/60)+(int(nwLong[6:])/3600)),3)
                                                            elif(nwLong[0] == "W"):                                                                                                                            
                                                                nwLong = (-1)*round((int(nwLong[1:4])+(int(nwLong[4:6])/60)+(int(nwLong[6:])/3600)),3)
                                                         
                                                        if(loc.tag == 'neLat'):
                                                            print("neLat : ",loc.text)
                                                            neLat = loc.text
                                                            if(neLat[0] == "N"):                                                                                                                            
                                                                neLat = round((int(neLat[1:4])+(int(neLat[4:6])/60)+(int(neLat[6:])/3600)),3)
                                                            elif(neLat[0] == "S"):                                                                                                                            
                                                                neLat = (-1)*round((int(neLat[1:4])+(int(neLat[4:6])/60)+(int(neLat[6:])/3600)),3)
                                                            
                                                        if(loc.tag == 'neLong'):
                                                            print("neLong : ",loc.text)
                                                            neLong = loc.text
                                                            if(neLong[0] == "E"):                                                                                                                            
                                                                neLong = round((int(neLong[1:4])+(int(neLong[4:6])/60)+(int(neLong[6:])/3600)),3)
                                                            elif(neLong[0] == "W"):                                                                                                                            
                                                                neLong = (-1)*round((int(neLong[1:4])+(int(neLong[4:6])/60)+(int(neLong[6:])/3600)),3)
                                                           
                                                        if(loc.tag == 'swLat'):
                                                            print("swLat : ",loc.text)
                                                            swLat = loc.text
                                                            if(swLat[0] == "N"):                                                                                                                            
                                                                swLat = round((int(swLat[1:4])+(int(swLat[4:6])/60)+(int(swLat[6:])/3600)),3)
                                                            elif(swLat[0] == "S"):                                                                                                                            
                                                                swLat = (-1)*round((int(swLat[1:4])+(int(swLat[4:6])/60)+(int(swLat[6:])/3600)),3)
                                                            
                                                        if(loc.tag == 'swLong'):
                                                            print("swLong : ", loc.text)
                                                            swLong = loc.text
                                                            if(swLong[0] == "E"):                                                                                                                            
                                                                swLong = round((int(swLong[1:4])+(int(swLong[4:6])/60)+(int(swLong[6:])/3600)),3)
                                                            elif(swLong[0] == "W"):                                                                                                                            
                                                                swLong = (-1)*round((int(swLong[1:4])+(int(swLong[4:6])/60)+(int(swLong[6:])/3600)),3)
                                                        if(loc.tag == 'seLat'):
                                                            print("seLat : ",loc.text)
                                                            seLat = loc.text
                                                            if(seLat[0] == "N"):                                                                                                                            
                                                                seLat = round((int(seLat[1:4])+(int(seLat[4:6])/60)+(int(seLat[6:])/3600)),3)
                                                            elif(seLat[0] == "S"):                                                                                                                            
                                                                seLat = (-1)*round((int(seLat[1:4])+(int(seLat[4:6])/60)+(int(seLat[6:])/3600)),3)
                                                        if(loc.tag == 'seLong'):
                                                            print("seLong : ",loc.text)
                                                            seLong = loc.text
                                                            if(seLong[0] == "E"):                                                                                                                            
                                                                seLong = round((int(seLong[1:4])+(int(seLong[4:6])/60)+(int(seLong[6:])/3600)),3)
                                                            elif(seLong[0] == "W"):                                                                                                                            
                                                                seLong = (-1)*round((int(seLong[1:4])+(int(seLong[4:6])/60)+(int(seLong[6:])/3600)),3)
                                                    image = 'http://127.0.0.1:3001/images/' + browseFileName
                                                    print(mission,revolutionNumber,instrumentType,
                                                    instrumentIdt,spectralMode,browseFileName,nwLat,nwLong,
                                                    neLat,neLong,swLat,swLong,seLat,seLong,date,time,moderaw,image,
                                                    kPath,jRow,sunAzimuth,sunElevation,latSceneCenter,longSceneCenter,
                                                    browseBeginLine,browseEndLine,i)
                                                    try:
                                                        cur = mysql.connection.cursor()
                                                        cur.execute(''' INSERT INTO all_image_order (DATE,TIME,MISSION,REVOLUTION_NUMBER,INSTRUMENT_TYPE,INSTRUMENT_INDEX,
                                                        MODE,PATH,ROW,SUN_AZIMUTH,SUN_ELEVATION,BROWSEBEGINLINE,BROWSEENDLINE,
                                                        NW_LAT,NW_LON,NE_LAT,NE_LON,SW_LAT,SW_LON,SE_LAT,SE_LON,CENTER_LAT,CENTER_LON,CLOUDCOVER,'''+ moderaw +''') SELECT * FROM (SELECT %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) AS Tmp 
                                                        WHERE NOT EXISTS (SELECT DATE,TIME,MISSION,REVOLUTION_NUMBER,MODE FROM all_image_order WHERE DATE = %s AND TIME = %s AND MISSION = %s AND REVOLUTION_NUMBER = %s
                                                        AND MODE = %s )LIMIT 1  ''', (date,time,mission,revolutionNumber,instrumentType,instrumentIdt,
                                                        spectralMode,kPath,jRow,sunAzimuth,sunElevation,browseBeginLine,browseEndLine,nwLat,nwLong,neLat,
                                                        neLong,swLat,swLong,seLat,seLong,latSceneCenter,longSceneCenter,cloudCover,image,date,time,
                                                        mission,revolutionNumber,spectralMode))
                                                        mysql.connection.commit()
                                                        cur.close()
                                                    except Exception as e:
                                                        print("cannot upload")
                                                        print(e)
                                                    
                                                    print('--------------')
                            try:
                                
                                shutil.rmtree(os.path.dirname(os.path.realpath(i)))
                                print("Remove CUF Complete")
                            except Exception as e:
                                print(e)


                        elif(i.endswith(".JPG")):
                            # print("abs : ",os.path.abspath(f))
                            zip.extract(i)
                            name = i.split("/")
                            # print(name[len(name)-1])
                            serverdir = os.path.abspath(f).split("venv")

                            # print("IMG : ", os.listdir(serverdir[0]))
                            for j in os.listdir(serverdir[0]):
                                if(j == "public"):
                                    imgpath = os.path.join(serverdir[0],j)
                                    newPath = os.path.join(imgpath,"images",name[len(name)-1])
                                    # print("NEW Path : ",newPath)
                            for j in os.listdir():
                                if(j == f.split(".zip")[0]):
                                    # print(os.getcwd())
                                    oldpath= os.path.join(os.getcwd(),j,name[len(name)-1])
                                    # print("Old path : ", oldpath)
                            if(os.path.exists(newPath)):
                                print("already have")
                                os.remove(oldpath)
                                print("remove complete")
                            else:
                                print("move")
                                shutil.move(oldpath,newPath)


                # print(dir[1:]+'/'+f)
                # if(f.endswith(".zip")):
                #     archive = ZipFile.open('./ziptest/TH_CAT_211208062559334_1_1M_S1891147_R68772_08DEC2021.zip', 'r')
                #     print(archive)
        try:
            shutil.rmtree('./ziptest')
            print("Remove ziptest complete")
            resp = make_response("finish")            
            resp.headers['Access-Control-Allow-Origin'] = '*'
        except Exception as e:
            print(e)
    except Exception as E:
        print(E)
        
    
    return resp

@app.route('/api/uploaddim', methods = ['POST'])
def uploaddim():
    file = request.files.getlist('file')
    if(os.path.exists('./ziptest')):
        print('True')
    else:
        os.makedirs("./ziptest")
    try:
        for file in request.files.getlist('file'):
            file.save(os.path.join("./ziptest", secure_filename(file.filename)))
        
        for dir,dirname,files in os.walk("./ziptest"):
            # print('dir = ',dir)
            # print('dirname = ',dirname)
            print('files = ',files)

            for f in files:
                if(f.endswith('.zip')or f.endswith(".ZIP")):
                    with ZipFile(dir+'/'+f, 'r') as zip:
                        # zip.printdir()
                        for i in zip.namelist():
                            print("i : ",i)
                            if(i.endswith('.DIM')):
                                print("DIM")
                                zip.extract(i)
                                tree = ET.parse(i)
                                root = tree.getroot()
                                lat = []
                                long = []
                                SCENE, SCENE_DISPLAY, SOURCE, FULLPATH, DATASET_NAME = None,None,None,None,None
                                print("pass 1")
                                PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION, GRID_REFERENCE, SHIFT_VALUE = None,None,None,None,None,None
                                print("pass 2")
                                IMAGING_DATE, IMAGING_TIME, MISSION, MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE = None,None,None,None,None,None,None
                                print("pass 3")
                                SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK, SATELLITE_INCIDENCE_ANGLE = None,None,None,None
                                print("pass 4")
                                SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION, REVOLUTION_NUMBER, THEORETICAL_RESOLUTION = None,None,None,None,None
                                print("pass 5")
                                GEO_TABLES, HORIZONTAL_CS_TYPE, HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN = None,None,None,None,None,None
                                print("pass 6")
                                JOB_ID, PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL = None,None,None,None,None
                                print("pass 7")
                                DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER, NCOLS, NROWS = None,None,None,None,None,None
                                print("pass 8")
                                NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT, PROCESSING_LEVEL, GEOMETRIC_PROCESSING = None,None,None,None,None,None,None
                                print("pass 9")
                                RADIOMETRIC_PROCESSING, ALGORITHM_TYPE, ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION = None,None,None,None,None
                                print("pass 10")
                                DATA_FILE_FORMAT, DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO = None,None,None,None,None,None,None
                                print("pass 11")
                                BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END, REFERENCE_BAND = None,None,None,None,None,None,None
                                print("pass 12")
                                REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE, YAW, PITCH, ROLL = None,None,None,None,None,None,None
                                print("pass 13")
                                CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME, ULXMAP, ULYMAP, XDIM = None,None,None,None,None,None
                                print("pass 14")
                                YDIM, LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,IMAGE = None,None,None,None,None,None,None
                                print('pass 15')
                                
                                
                                SOURCE = f
                                FULLPATH = 'public/files'
                                
                                for Dataset_Id in root.findall('Dataset_Id'):
                                    DATASET_NAME = Dataset_Id.find('DATASET_NAME').text
                                    PROLINE_NAME = ((DATASET_NAME.replace(" ","_")).replace(":","-")).replace("/","-")
                                    print(DATASET_NAME,PROLINE_NAME)
                                for Dataset_Frame in root.findall('Dataset_Frame'):
                                    for Vertex in Dataset_Frame.findall('Vertex'):
                                        lat.append(Vertex.find('FRAME_LON'))
                                        long.append(Vertex.find('FRAME_LON'))
                                Vertex_LON_NW = long[0].text
                                Vertex_LAT_NW = long[0].text
                                Vertex_LON_NE = long[1].text
                                Vertex_LAT_NE = long[1].text
                                Vertex_LON_SW = long[2].text
                                Vertex_LAT_SW = long[2].text
                                Vertex_LON_SE = long[3].text
                                Vertex_LAT_SE = long[3].text
                                print(Vertex_LON_NW,Vertex_LAT_NW,Vertex_LON_NE,Vertex_LAT_NE,Vertex_LON_SW,Vertex_LAT_SW,Vertex_LON_SE,Vertex_LAT_SE)
                                for Dataset_Sources in  root.findall('Dataset_Sources'):
                                    for Source_Information in Dataset_Sources.findall('Source_Information'):
                                        SOURCE_TYPE = Source_Information.find('SOURCE_TYPE').text
                                        SOURCE_ID = Source_Information.find('SOURCE_ID').text
                                        SOURCE_DESCRIPTION = Source_Information.find('SOURCE_DESCRIPTION').text
                                        for Scene_Source in Source_Information.findall('Scene_Source'):
                                            GRID_REFERENCE = Scene_Source.find('GRID_REFERENCE').text
                                            SHIFT_VALUE = Scene_Source.find('SHIFT_VALUE').text
                                            IMAGING_DATE = Scene_Source.find('IMAGING_DATE').text
                                            IMAGING_TIME = Scene_Source.find('IMAGING_TIME').text
                                            SUN_AZIMUTH = Scene_Source.find('SUN_AZIMUTH').text
                                            SUN_ELEVATION = Scene_Source.find('SUN_ELEVATION').text
                                            MISSION = Scene_Source.find('MISSION').text
                                            MISSION_INDEX = Scene_Source.find('MISSION').text
                                            INSTRUMENT = Scene_Source.find('INSTRUMENT').text
                                            INSTRUMENT_INDEX = Scene_Source.find('INSTRUMENT_INDEX').text
                                            IMAGING_MODE = Scene_Source.find('IMAGING_MODE').text
                                            SCENE_PROCESSING_LEVEL = Scene_Source.find('SCENE_PROCESSING_LEVEL').text
                                            VIEWING_ANGLE_ALONG_TRACK = Scene_Source.find('VIEWING_ANGLE_ALONG_TRACK').text
                                            VIEWING_ANGLE_ACROSS_TRACK = Scene_Source.find('VIEWING_ANGLE_ACROSS_TRACK').text
                                            SATELLITE_INCIDENCE_ANGLE = Scene_Source.find('SATELLITE_INCIDENCE_ANGLE').text
                                            SATELLITE_AZIMUTH_ANGLE = Scene_Source.find('SATELLITE_AZIMUTH_ANGLE').text
                                            REVOLUTION_NUMBER = Scene_Source.find('REVOLUTION_NUMBER').text
                                            THEORETICAL_RESOLUTION = Scene_Source.find('THEORETICAL_RESOLUTION').text                       
                                    PATH = GRID_REFERENCE.split("-")[0]
                                    ROW = GRID_REFERENCE.split("-")[1]
                                    YEAR =IMAGING_DATE.split("-")[0]
                                    MONTH = IMAGING_DATE.split("-")[1]
                                    DATE = IMAGING_DATE.split("-")[2]

                                    HOUR = IMAGING_TIME.split(":")[0]
                                    MINUTE = IMAGING_TIME.split(":")[1]
                                    SECOND = IMAGING_TIME.split(":")[2]
                                print('Dataset_Sources : ',SOURCE_TYPE,SOURCE_ID,SOURCE_DESCRIPTION,GRID_REFERENCE,SHIFT_VALUE,YEAR,
                                        MONTH,DATE,HOUR,MINUTE,SECOND,SUN_AZIMUTH
                                        ,SUN_ELEVATION,MISSION,MISSION_INDEX,INSTRUMENT,
                                        INSTRUMENT_INDEX,IMAGING_MODE,SCENE_PROCESSING_LEVEL
                                        ,VIEWING_ANGLE_ALONG_TRACK,VIEWING_ANGLE_ACROSS_TRACK,
                                        SATELLITE_INCIDENCE_ANGLE,SATELLITE_AZIMUTH_ANGLE,REVOLUTION_NUMBER
                                        ,THEORETICAL_RESOLUTION,PATH,ROW)
                                for Coordinate_Reference_System in root.findall('Coordinate_Reference_System'):
                                    GEO_TABLES = Coordinate_Reference_System.find('GEO_TABLES').text
                                    for Horizontal_CS in Coordinate_Reference_System.findall('Horizontal_CS'):
                                        HORIZONTAL_CS_TYPE = Horizontal_CS.find('HORIZONTAL_CS_TYPE').text
                                        HORIZONTAL_CS_CODE = Horizontal_CS.find('HORIZONTAL_CS_CODE').text
                                        HORIZONTAL_CS_NAME = Horizontal_CS.find('HORIZONTAL_CS_NAME').text
                                print("Coordinate_Reference_System : ", GEO_TABLES,HORIZONTAL_CS_TYPE,HORIZONTAL_CS_CODE,HORIZONTAL_CS_NAME)
                                for Raster_CS in root.findall('Raster_CS'):
                                    RASTER_CS_TYPE = Raster_CS.find('RASTER_CS_TYPE').text
                                    PIXEL_ORIGIN = Raster_CS.find('PIXEL_ORIGIN').text
                                print("Raster_CS : ",RASTER_CS_TYPE,PIXEL_ORIGIN)
                                for Production in root.findall('Production'):
                                    JOB_ID = Production.find('JOB_ID').text
                                    PRODUCT_INFO = Production.find('PRODUCT_INFO').text
                                    PRODUCT_TYPE = Production.find('PRODUCT_TYPE').text
                                    DATASET_PRODUCER_NAME = Production.find('DATASET_PRODUCER_NAME').text
                                    DATASET_PRODUCER_URL = Production.find('DATASET_PRODUCER_URL').attrib['href']
                                    DATASET_PRODUCTION_DATE = Production.find('DATASET_PRODUCTION_DATE').text
                                    for Production_Facility in Production.findall('Production_Facility'):
                                        SOFTWARE_NAME = Production_Facility.find('SOFTWARE_NAME').text
                                        SOFTWARE_VERSION = Production_Facility.find('SOFTWARE_VERSION').text
                                        PROCESSING_CENTER = Production_Facility.find('PROCESSING_CENTER').text
                                imagePath = os.path.dirname(os.path.realpath(i))
                                if(os.path.exists(os.path.join(imagePath,'PREVIEW.JPG'))):
                                    print("Have Preview file")
                                    os.rename(os.path.join(imagePath,'PREVIEW.JPG'),os.path.join(imagePath,JOB_ID)+'.JPG')
                                else:
                                    print("Not have Preview file")
                                    
                                print("Production : ",JOB_ID,PRODUCT_INFO,PRODUCT_TYPE,DATASET_PRODUCER_NAME
                                    ,DATASET_PRODUCTION_DATE,SOFTWARE_NAME,SOFTWARE_VERSION,PROCESSING_CENTER)
                                for Raster_Dimensions in root.findall('Raster_Dimensions'):
                                    NCOLS = Raster_Dimensions.find('NCOLS').text
                                    NROWS = Raster_Dimensions.find('NROWS').text
                                    NBANDS = Raster_Dimensions.find('NBANDS').text
                                print("Raster_Dimensions : ",NCOLS,NROWS,NBANDS)
                                for Raster_Encoding in root.findall('Raster_Encoding'):
                                    NBITS = Raster_Encoding.find('NBITS').text
                                    DATA_TYPE = Raster_Encoding.find('DATA_TYPE').text
                                    BYTEORDER = Raster_Encoding.find('BYTEORDER').text
                                    BANDS_LAYOUT = Raster_Encoding.find('BANDS_LAYOUT').text
                                print("Raster_Encoding : ",NBITS,DATA_TYPE,BYTEORDER,BANDS_LAYOUT)
                                for Data_Processing in root.findall('Data_Processing'):
                                    PROCESSING_LEVEL = Data_Processing.find('PROCESSING_LEVEL').text
                                    GEOMETRIC_PROCESSING = Data_Processing.find('GEOMETRIC_PROCESSING').text
                                    RADIOMETRIC_PROCESSING = Data_Processing.find('RADIOMETRIC_PROCESSING').text
                                print("Data_Processing : ",PROCESSING_LEVEL,GEOMETRIC_PROCESSING,RADIOMETRIC_PROCESSING)
                                for Data_Access in root.findall('Data_Access'):
                                    DATA_FILE_ORGANISATION = Data_Access.find('DATA_FILE_ORGANISATION').text
                                    DATA_FILE_FORMAT = Data_Access.find('DATA_FILE_FORMAT').text
                                    for Data_File in Data_Access.findall('Data_File'):
                                        DATA_FILE_PATH = Data_File.find('DATA_FILE_PATH').text
                                print("Data_Access : ",DATA_FILE_ORGANISATION,DATA_FILE_FORMAT,
                                    DATA_FILE_PATH)
                                for Data_Strip in root.findall('Data_Strip'):
                                    for Data_Strip_Identification in Data_Strip.findall('Data_Strip_Identification'):
                                        DATA_STRIP_ID = Data_Strip_Identification.find('DATA_STRIP_ID').text
                                        LCNT = Data_Strip_Identification.find('LCNT').text
                                        IGPST = Data_Strip_Identification.find('IGPST').text
                                        FILE_NAME = Data_Strip_Identification.find('FILE_NAME').text
                                        COMPRESSION_RATIO = Data_Strip_Identification.find('COMPRESSION_RATIO').text
                                    print('Data_Strip_Identification : ',DATA_STRIP_ID,LCNT,
                                        IGPST,FILE_NAME,COMPRESSION_RATIO)
                                    for Time_Stamp in Data_Strip.findall('Time_Stamp'):
                                        REFERENCE_BAND = Time_Stamp.find('REFERENCE_BAND').text
                                        REFERENCE_TIME = Time_Stamp.find('REFERENCE_TIME').text
                                        REFERENCE_LINE = Time_Stamp.find('REFERENCE_LINE').text
                                        LINE_PERIOD = Time_Stamp.find('LINE_PERIOD').text  
                                    print("Time_Stamp : ",REFERENCE_BAND,REFERENCE_TIME,
                                        REFERENCE_LINE,LINE_PERIOD)                                  
                                    for Ephemeris in Data_Strip.findall('Ephemeris'):
                                        SATELLITE_ALTITUDE = Ephemeris.find('SATELLITE_ALTITUDE').text
                                    print("SATELLITE_ALTITUDE : ",SATELLITE_ALTITUDE)
                                    for Sensor_Configuration in Data_Strip.findall('Sensor_Configuration'):
                                        for Instrument_Biases in Sensor_Configuration.findall("Instrument_Biases"):
                                            YAW = Instrument_Biases.find('YAW').text
                                            PITCH = Instrument_Biases.find('PITCH').text
                                            ROLL = Instrument_Biases.find('ROLL').text
                                    print("Sensor_Configuration : ",YAW,PITCH,ROLL)
                                    for Sensor_Calibration in Data_Strip.findall('Sensor_Calibration'):
                                        for Calibration in Sensor_Calibration.findall('Calibration'):
                                            CALIBRATION_TYPE = Calibration.find('CALIBRATION_TYPE').text
                                            CALIBRATION_VALIDITY = Calibration.find('CALIBRATION_VALIDITY').text
                                            CALIBRATION_FILENAME = Calibration.find('CALIBRATION_FILENAME').text
                                    print("Sensor_Calibration : ",CALIBRATION_TYPE,CALIBRATION_VALIDITY,
                                        CALIBRATION_FILENAME)
                                MODE = IMAGING_MODE
                                PREFIX = "th1"
                                if (MODE == 'MS'):
                                    MODE = "MSS"
                                
                                if (HORIZONTAL_CS_CODE == 'epsg:4326' and len(HORIZONTAL_CS_NAME.split("/")) == 1):
                                    PROJ = "gcs"
                                else:
                                    PROJ = HORIZONTAL_CS_NAME.split("/")[1].replace("UTM","").lower()
                                if (DATASET_NAME.split(" ")[2] == "P+M"):
                                    SCENE = PREFIX+"_"+YEAR+MONTH+DATE+"_"+HOUR+MINUTE+str(SECOND).split(".")[0]+"_psp_"+PROJ
                                    SCENE_DISPLAY = PREFIX+"_"+YEAR+MONTH+DATE+"_"+HOUR+MINUTE+str(SECOND).split(".")[0]+"_psp"
                                else:
                                    SCENE = PREFIX+"_"+YEAR+MONTH+DATE+"_"+HOUR+MINUTE+str(SECOND).split(".")[0]+"_"+MODE.lower()+"_"+PROJ
                                    SCENE_DISPLAY = PREFIX+"_"+YEAR+MONTH+DATE+"_"+HOUR+MINUTE+str(SECOND).split(".")[0]+"_"+MODE.lower()
                                PATH = (int(PATH)) 
                                ROW = (int(ROW)) 
                                time = HOUR+':'+MINUTE+':'+  SECOND[0:2]
                                
                                SUN_AZIMUTH = round(float(SUN_AZIMUTH),2)
                                SUN_ELEVATION = round(float(SUN_ELEVATION),2)

                                Vertex_LON_NW = round(float(Vertex_LON_NW),3)
                                Vertex_LAT_NW = round(float(Vertex_LAT_NW),3)
                                Vertex_LON_NE = round(float(Vertex_LON_NE),3)
                                Vertex_LAT_NE = round(float(Vertex_LAT_NE),3)
                                Vertex_LON_SW = round(float(Vertex_LON_SW),3)
                                Vertex_LAT_SW = round(float(Vertex_LAT_SW),3)
                                Vertex_LON_SE = round(float(Vertex_LON_SE),3)
                                Vertex_LAT_SE = round(float(Vertex_LAT_SE),3)
                                crsx = []
                                crsy = []
                                datax = []
                                datay = []
                                AL_Type = []
                                AL_Name = []
                                AL_Act = []
                                BAND_INDEXLIST = []
                                BAND_OFFSETLIST = []
                                SFSC_BEGINLIST = []
                                SFSC_ENDLIST = []
                                DSR_BEGINLIST = []
                                DSR_ENDLIST =[]
                                LINE_NUMBERLIST = []
                                GAIN_NUMBERLIST =[]
                                PHYSICAL_BIASLIST =[]
                                PHYSICAL_GAINLIST = []
                                PHYSICAL_UNITLIST =[]
                                print("start 1A")
                                if(PROCESSING_LEVEL == "1A"):
                                    for Geoposition in root.findall('Geoposition'):
                                        for Geoposition_Points in Geoposition.findall('Geoposition_Points'):
                                            for Tie_Point in Geoposition_Points.findall('Tie_Point'):
                                                crsx.append(Tie_Point.find('TIE_POINT_CRS_X').text)
                                                crsy.append(Tie_Point.find('TIE_POINT_CRS_Y').text)
                                                datax.append(Tie_Point.find('TIE_POINT_DATA_X').text)
                                                datay.append(Tie_Point.find('TIE_POINT_DATA_Y').text)
                                    TIE_POINT_CRS_X1 = crsx[0]
                                    TIE_POINT_CRS_Y1 = crsy[0]
                                    TIE_POINT_DATA_X1 = datax[0]
                                    TIE_POINT_DATA_Y1 = datay[0]
                                    TIE_POINT_CRS_X2 = crsx[1]
                                    TIE_POINT_CRS_Y2 = crsy[1]
                                    TIE_POINT_DATA_X2 = datax[1]
                                    TIE_POINT_DATA_Y2 = datay[1]
                                    TIE_POINT_CRS_X3 = crsx[2]
                                    TIE_POINT_CRS_Y3 = crsy[2]
                                    TIE_POINT_DATA_X3 = datax[2]
                                    TIE_POINT_DATA_Y3 = datay[2]
                                    TIE_POINT_CRS_X4 = crsx[3]
                                    TIE_POINT_CRS_Y4 = crsy[3]
                                    TIE_POINT_DATA_X4 = datax[3]
                                    TIE_POINT_DATA_Y4 = datay[3]
                                    print("Start MS")
                                    if(IMAGING_MODE == 'MS'):
                                        for Data_Processing in root.findall('Data_Processing'):
                                            for Processing_Options in Data_Processing.findall('Processing_Options'):
                                                for Correction_Algorithm in Processing_Options.findall('Correction_Algorithm'):
                                                    AL_Type.append(Correction_Algorithm.find("ALGORITHM_TYPE").text)
                                                    AL_Name.append(Correction_Algorithm.find('ALGORITHM_NAME').text)
                                                    AL_Act.append(Correction_Algorithm.find('ALGORITHM_ACTIVATION').text)
                                        print("AlgoType : ",AL_Type)
                                        print("AlgoName : ",AL_Name)
                                        print("AlgoACT : ",AL_Act)
                                        ALGORITHM_TYPE_1 =AL_Type[0]
                                        ALGORITHM_NAME_1 = AL_Name[0]
                                        ALGORITHM_ACTIVATION_1 = AL_Act[0]
                            
                                        ALGORITHM_TYPE_2 = AL_Type[1]
                                        ALGORITHM_NAME_2 = AL_Name[1]
                                        ALGORITHM_ACTIVATION_2 = AL_Act[1]
                            
                                        ALGORITHM_TYPE_3 =AL_Type[2]
                                        ALGORITHM_NAME_3 = AL_Name[2]
                                        ALGORITHM_ACTIVATION_3 = AL_Act[2]
                                        for Data_Strip in root.findall('Data_Strip'):
                                            for Frame_Counters in Data_Strip.findall('Frame_Counters'):
                                                for Band_Counters in Frame_Counters.findall('Band_Counters'):
                                                    BAND_INDEXLIST.append(Band_Counters.find('BAND_INDEX').text)
                                                    BAND_OFFSETLIST.append(Band_Counters.find('BAND_OFFSET').text)
                                                    SFSC_BEGINLIST.append(Band_Counters.find('SFSC_BEGIN').text)
                                                    SFSC_ENDLIST.append(Band_Counters.find('SFSC_END').text)
                                                    DSR_BEGINLIST.append(Band_Counters.find('DSR_BEGIN').text)
                                                    DSR_ENDLIST.append(Band_Counters.find("DSR_END").text)
                                        print("BAND_INDEXLIST : ", BAND_INDEXLIST)
                                        print("BAND_OFFSETLIST : ", BAND_OFFSETLIST)
                                        print('SFSC_BEGINLIST : ', SFSC_BEGINLIST)
                                        print('SFSC_ENDLIST : ',SFSC_ENDLIST )
                                        print('DSR_BEGINLIST : ',DSR_BEGINLIST)
                                        print('DSR_ENDLIST : ',DSR_ENDLIST)
                                        BAND_INDEX_1 = BAND_INDEXLIST[0]
                                        BAND_OFFSET_1 = BAND_OFFSETLIST[0]
                                        SFSC_BEGIN_1 = SFSC_BEGINLIST[0]
                                        SFSC_END_1 = SFSC_ENDLIST[0]
                                        DSR_BEGIN_1 = DSR_BEGINLIST[0]
                                        DSR_END_1 = DSR_ENDLIST[0]
                            
                                        BAND_INDEX_2 = BAND_INDEXLIST[1]
                                        BAND_OFFSET_2 = BAND_OFFSETLIST[1]
                                        SFSC_BEGIN_2 = SFSC_BEGINLIST[1]
                                        SFSC_END_2 = SFSC_ENDLIST[1]
                                        DSR_BEGIN_2 = DSR_BEGINLIST[1]
                                        DSR_END_2 = DSR_ENDLIST[1]
                            
                                        BAND_INDEX_3 = BAND_INDEXLIST[2]
                                        BAND_OFFSET_3 = BAND_OFFSETLIST[2]
                                        SFSC_BEGIN_3 = SFSC_BEGINLIST[2]
                                        SFSC_END_3 = SFSC_ENDLIST[2]
                                        DSR_BEGIN_3 = DSR_BEGINLIST[2]
                                        DSR_END_3 = DSR_ENDLIST[2]
                            
                                        BAND_INDEX_4 = BAND_INDEXLIST[3]
                                        BAND_OFFSET_4 = BAND_OFFSETLIST[3]
                                        SFSC_BEGIN_4 = SFSC_BEGINLIST[3]
                                        SFSC_END_4 = SFSC_ENDLIST[3]
                                        DSR_BEGIN_4 = DSR_BEGINLIST[3]
                                        DSR_END_4 = DSR_ENDLIST[3]
                                        
                                        for Data_Strip in root.findall('Data_Strip'):
                                            for Sensor_Calibration in Data_Strip.findall('Sensor_Calibration'):
                                                for Calibration in Sensor_Calibration.findall('Calibration'):
                                                    for Band_Parameters in Calibration.findall('Band_Parameters'):
                                                        for Gain_Section_List in Band_Parameters.findall('Gain_Section_List'):
                                                            for Gain_Section in Gain_Section_List.findall('Gain_Section'):
                                                                LINE_NUMBERLIST.append(Gain_Section.find('LINE_NUMBER').text)
                                                                GAIN_NUMBERLIST.append(Gain_Section.find('GAIN_NUMBER').text)
                                                                PHYSICAL_BIASLIST.append(Gain_Section.find('PHYSICAL_BIAS').text)
                                                                PHYSICAL_GAINLIST.append(Gain_Section.find('PHYSICAL_GAIN').text)
                                                                PHYSICAL_UNITLIST.append(Gain_Section.find('PHYSICAL_UNIT').text)
                                        
                                        print("LINE_NUMBERLIST : ", LINE_NUMBERLIST)
                                        print("GAIN_NUMBERLIST : ",GAIN_NUMBERLIST)
                                        print("PHYSICAL_BIASLIST : ", PHYSICAL_BIASLIST)
                                        print("PHYSICAL_GAINLIST : ",PHYSICAL_GAINLIST )
                                        print('PHYSICAL_UNITLIST : ',PHYSICAL_UNITLIST)
                                        LINE_NUMBER_1 = LINE_NUMBERLIST[0]
                                        GAIN_NUMBER_1 = GAIN_NUMBERLIST[0]
                                        PHYSICAL_BIAS_1 = PHYSICAL_BIASLIST[0]
                                        PHYSICAL_GAIN_1 = PHYSICAL_GAINLIST[0]
                                        PHYSICAL_UNIT_1 = PHYSICAL_UNITLIST[0]
                            
                                        LINE_NUMBER_2 = LINE_NUMBERLIST[1]
                                        GAIN_NUMBER_2 = GAIN_NUMBERLIST[1]
                                        PHYSICAL_BIAS_2 = PHYSICAL_BIASLIST[1]
                                        PHYSICAL_GAIN_2 = PHYSICAL_GAINLIST[1]
                                        PHYSICAL_UNIT_2 = PHYSICAL_UNITLIST[1]
                            
                                        LINE_NUMBER_3 = LINE_NUMBERLIST[2]
                                        GAIN_NUMBER_3 = GAIN_NUMBERLIST[2]
                                        PHYSICAL_BIAS_3 = PHYSICAL_BIASLIST[2]
                                        PHYSICAL_GAIN_3 = PHYSICAL_GAINLIST[2]
                                        PHYSICAL_UNIT_3 = PHYSICAL_UNITLIST[2]
                            
                                        LINE_NUMBER_4 = LINE_NUMBERLIST[3]
                                        GAIN_NUMBER_4 = GAIN_NUMBERLIST[3]
                                        PHYSICAL_BIAS_4 = PHYSICAL_BIASLIST[3]
                                        PHYSICAL_GAIN_4 = PHYSICAL_GAINLIST[3]
                                        PHYSICAL_UNIT_4 = PHYSICAL_UNITLIST[3]
                            
                            
                                        ALGORITHM_TYPE = ALGORITHM_TYPE_1+"|"+ALGORITHM_TYPE_2+"|"+ALGORITHM_TYPE_3
                                        ALGORITHM_NAME = ALGORITHM_NAME_1+"|"+ALGORITHM_NAME_2+"|"+ALGORITHM_NAME_3
                                        ALGORITHM_ACTIVATION = ALGORITHM_ACTIVATION_1+"|"+ALGORITHM_ACTIVATION_2+"|"+ALGORITHM_ACTIVATION_3
                                        BAND_INDEX = BAND_INDEX_1+"|"+BAND_INDEX_2+"|"+BAND_INDEX_3+"|"+BAND_INDEX_4
                                        BAND_OFFSET = BAND_OFFSET_1+"|"+BAND_OFFSET_2+"|"+BAND_OFFSET_3+"|"+BAND_OFFSET_4
                                        SFSC_BEGIN = SFSC_BEGIN_1+"|"+SFSC_BEGIN_2+"|"+SFSC_BEGIN_3+"|"+SFSC_BEGIN_4
                                        SFSC_END = SFSC_END_1+"|"+SFSC_END_2+"|"+SFSC_END_3+"|"+SFSC_END_4
                                        DSR_BEGIN = DSR_BEGIN_1+"|"+DSR_BEGIN_2+"|"+DSR_BEGIN_3+"|"+DSR_BEGIN_4
                                        DSR_END = DSR_END_1+"|"+DSR_END_2+"|"+DSR_END_3+"|"+DSR_END_4
                                        serverdir = os.path.abspath(f).split("venv")
                                        for ser in os.listdir(serverdir[0]):
                                            if(ser == "public"):
                                                imgpath = os.path.join(serverdir[0],ser)
                                                newPath = os.path.join(imgpath,"MS1A",JOB_ID+'.JPG')
                                                print("Newpath : ", newPath)
                                        if(os.path.exists(os.path.join(imagePath,JOB_ID)+'.JPG')):
                                            shutil.move(os.path.join(imagePath,JOB_ID)+'.JPG',newPath)
                                        print("END MS")
                                    else:
                                        print("Start Pan 1A")
                                        for Data_Processing in root.findall('Data_Processing'):
                                            for Processing_Options in Data_Processing.findall('Processing_Options'):
                                                for Correction_Algorithm in Processing_Options.findall('Correction_Algorithm'):
                                                    AL_Type.append(Correction_Algorithm.find("ALGORITHM_TYPE").text)
                                                    AL_Name.append(Correction_Algorithm.find('ALGORITHM_NAME').text)
                                                    AL_Act.append(Correction_Algorithm.find('ALGORITHM_ACTIVATION').text)

                                        ALGORITHM_TYPE_1 =AL_Type[0]
                                        ALGORITHM_NAME_1 = AL_Name[0]
                                        ALGORITHM_ACTIVATION_1 = AL_Act[0]
                            
                                        for Data_Strip in root.findall('Data_Strip'):
                                            for Frame_Counters in Data_Strip.findall('Frame_Counters'):
                                                for Band_Counters in Frame_Counters.findall('Band_Counters'):
                                                    BAND_INDEXLIST.append(Band_Counters.find('BAND_INDEX').text)
                                                    BAND_OFFSETLIST.append(Band_Counters.find('BAND_OFFSET').text)
                                                    SFSC_BEGINLIST.append(Band_Counters.find('SFSC_BEGIN').text)
                                                    SFSC_ENDLIST.append(Band_Counters.find('SFSC_END').text)
                                                    DSR_BEGINLIST.append(Band_Counters.find('DSR_BEGIN').text)
                                                    DSR_ENDLIST.append(Band_Counters.find("DSR_END").text)
                                                    
                                        BAND_INDEX_1 = BAND_INDEXLIST[0]
                                        BAND_OFFSET_1 = BAND_OFFSETLIST[0]
                                        SFSC_BEGIN_1 = SFSC_BEGINLIST[0]
                                        SFSC_END_1 = SFSC_ENDLIST[0]
                                        DSR_BEGIN_1 = DSR_BEGINLIST[0]
                                        DSR_END_1 = DSR_ENDLIST[0]
                                        for Data_Strip in root.findall('Data_Strip'):
                                            for Sensor_Calibration in Data_Strip.findall('Sensor_Calibration'):
                                                for Calibration in Sensor_Calibration.findall('Calibration'):
                                                    for Band_Parameters in Calibration.findall('Band_Parameters'):
                                                        for Gain_Section_List in Band_Parameters.findall('Gain_Section_List'):
                                                            for Gain_Section in Gain_Section_List.findall('Gain_Section'):
                                                                LINE_NUMBERLIST.append(Gain_Section.find('LINE_NUMBER').text)
                                                                GAIN_NUMBERLIST.append(Gain_Section.find('GAIN_NUMBER').text)
                                                                PHYSICAL_BIASLIST.append(Gain_Section.find('PHYSICAL_BIAS').text)
                                                                PHYSICAL_GAINLIST.append(Gain_Section.find('PHYSICAL_GAIN').text)
                                                                PHYSICAL_UNITLIST.append(Gain_Section.find('PHYSICAL_UNIT').text)
                                        
                                        
                                        LINE_NUMBER_1 = LINE_NUMBERLIST[0]
                                        GAIN_NUMBER_1 = GAIN_NUMBERLIST[0]
                                        PHYSICAL_BIAS_1 = PHYSICAL_BIASLIST[0]
                                        PHYSICAL_GAIN_1 = PHYSICAL_GAINLIST[0]
                                        PHYSICAL_UNIT_1 = PHYSICAL_UNITLIST[0]
                                        
                                        ALGORITHM_TYPE = ALGORITHM_TYPE_1
                                        ALGORITHM_NAME = ALGORITHM_NAME_1
                                        ALGORITHM_ACTIVATION = ALGORITHM_ACTIVATION_1
                                        BAND_INDEX = BAND_INDEX_1
                                        BAND_OFFSET = BAND_OFFSET_1
                                        SFSC_BEGIN = SFSC_BEGIN_1
                                        SFSC_END = SFSC_END_1
                                        DSR_BEGIN = DSR_BEGIN_1
                                        DSR_END = DSR_END_1
                                        serverdir = os.path.abspath(f).split("venv")
                                        for ser in os.listdir(serverdir[0]):
                                            if(ser == "public"):
                                                imgpath = os.path.join(serverdir[0],ser)
                                                newPath = os.path.join(imgpath,"PAN1A",JOB_ID+'.JPG')
                                                print("Newpath : ", newPath)
                                        if(os.path.exists(os.path.join(imagePath,JOB_ID)+'.JPG')):
                                            shutil.move(os.path.join(imagePath,JOB_ID)+'.JPG',newPath)
                                        print("END PAN 1A")
                                else:
                                    print("Start 2A")
                                    for Geoposition in root.findall("Geoposition"):       
                                        for Geoposition_Insert in Geoposition.findall('Geoposition_Insert'):
                                                        
                                            ULXMAP = Geoposition_Insert.find('ULXMAP').text
                                            ULYMAP = Geoposition_Insert.find('ULYMAP').text
                                            XDIM = Geoposition_Insert.find('XDIM').text
                                            YDIM = Geoposition_Insert.find('YDIM').text
                                    print("MS 2A")       
                                    if(IMAGING_MODE == 'MS'):                                    
                                        for Data_Processing in root.findall('Data_Processing'):
                                            for Processing_Options in Data_Processing.findall('Processing_Options'):
                                                for Correction_Algorithm in Processing_Options.findall('Correction_Algorithm'):
                                                    AL_Type.append(Correction_Algorithm.find('ALGORITHM_TYPE').text)
                                                    AL_Name.append(Correction_Algorithm.find('ALGORITHM_NAME').text)
                                                    AL_Act.append(Correction_Algorithm.find('ALGORITHM_ACTIVATION').text)
                                                    
                                        print("AL_Type : ",AL_Type)
                                        print("AL_Name : ",AL_Name)
                                        print('AL_Act : ',AL_Act)
                                        ALGORITHM_TYPE_1 = AL_Type[0]
                                        ALGORITHM_NAME_1 = AL_Name[0]
                                        ALGORITHM_ACTIVATION_1 = AL_Act[0]
                            
                                        ALGORITHM_TYPE_2 = AL_Type[1]
                                        ALGORITHM_NAME_2 = AL_Name[1]
                                        ALGORITHM_ACTIVATION_2 = AL_Act[1]

                                        for Data_Strip in root.findall('Data_Strip'):
                                            for Frame_Counters in Data_Strip.findall('Frame_Counters'):
                                                for Band_Counters in Frame_Counters.findall('Band_Counters'):
                                                    BAND_INDEXLIST.append(Band_Counters.find('BAND_INDEX').text)
                                                    BAND_OFFSETLIST.append(Band_Counters.find('BAND_OFFSET').text)
                                                    SFSC_BEGINLIST.append(Band_Counters.find('SFSC_BEGIN').text)
                                                    SFSC_ENDLIST.append(Band_Counters.find('SFSC_END').text)
                                                    DSR_BEGINLIST.append(Band_Counters.find('DSR_BEGIN').text)
                                                    DSR_ENDLIST.append(Band_Counters.find('DSR_END').text)
                                        print('BAND_INDEXLIST : ',BAND_INDEXLIST)
                                        print('BAND_OFFSETLIST : ',BAND_OFFSETLIST)
                                        print("SFSC_BEGINLIST : ",SFSC_BEGINLIST)
                                        print("SFSC_ENDLIST : ",SFSC_ENDLIST)
                                        print("DSR_BEGINLIST : ",DSR_BEGINLIST)
                                        print("DSR_ENDLIST : ",DSR_ENDLIST)
                                        BAND_INDEX_1 = BAND_INDEXLIST[0]
                                        BAND_OFFSET_1 = BAND_OFFSETLIST[0]
                                        SFSC_BEGIN_1 = SFSC_BEGINLIST[0]
                                        SFSC_END_1 = SFSC_ENDLIST[0]
                                        DSR_BEGIN_1 = DSR_BEGINLIST[0]
                                        DSR_END_1 = DSR_ENDLIST[0]
                            
                                        BAND_INDEX_2 = BAND_INDEXLIST[1]
                                        BAND_OFFSET_2 = BAND_OFFSETLIST[1]
                                        SFSC_BEGIN_2 = SFSC_BEGINLIST[1]
                                        SFSC_END_2 =SFSC_ENDLIST[1]
                                        DSR_BEGIN_2 = DSR_BEGINLIST[1]
                                        DSR_END_2 = DSR_ENDLIST[1]
                            
                                        BAND_INDEX_3 = BAND_INDEXLIST[2]
                                        BAND_OFFSET_3 = BAND_OFFSETLIST[2]
                                        SFSC_BEGIN_3 = SFSC_BEGINLIST[2]
                                        SFSC_END_3 = SFSC_ENDLIST[2]
                                        DSR_BEGIN_3 = DSR_BEGINLIST[2]
                                        DSR_END_3 = DSR_ENDLIST[2]
                            
                                        BAND_INDEX_4 = BAND_INDEXLIST[3]
                                        BAND_OFFSET_4 = BAND_OFFSETLIST[3]
                                        SFSC_BEGIN_4 = SFSC_BEGINLIST[3]
                                        SFSC_END_4 = SFSC_ENDLIST[3]
                                        DSR_BEGIN_4 = DSR_BEGINLIST[3]
                                        DSR_END_4 = DSR_ENDLIST[3]

                                        for Data_Strip in root.findall('Data_Strip'):
                                            for Sensor_Calibration in Data_Strip.findall('Sensor_Calibration'):
                                                for Calibration in Sensor_Calibration.findall('Calibration'):
                                                    for Band_Parameters in Calibration.findall('Band_Parameters'):
                                                        for Gain_Section_List in Band_Parameters.findall('Gain_Section_List'):
                                                            for Gain_Section in Gain_Section_List.findall('Gain_Section'):
                                                                LINE_NUMBERLIST.append(Gain_Section.find('LINE_NUMBER').text)
                                                                GAIN_NUMBERLIST.append(Gain_Section.find('GAIN_NUMBER').text)
                                                                PHYSICAL_BIASLIST.append(Gain_Section.find('PHYSICAL_BIAS').text)
                                                                PHYSICAL_GAINLIST.append(Gain_Section.find('PHYSICAL_GAIN').text)
                                                                PHYSICAL_UNITLIST.append(Gain_Section.find('PHYSICAL_UNIT').text)
                                        print("LINE_NUMBERLIST : ",LINE_NUMBERLIST)
                                        print("GAIN_NUMBERLIST : ",GAIN_NUMBERLIST)
                                        print("PHYSICAL_BIASLIST : ",PHYSICAL_BIASLIST )
                                        print("PHYSICAL_GAINLIST : ",PHYSICAL_GAINLIST)
                                        print("PHYSICAL_UNITLIST : ",PHYSICAL_UNITLIST)
                                        LINE_NUMBER_1 = LINE_NUMBERLIST[0]
                                        GAIN_NUMBER_1 = GAIN_NUMBERLIST[0]
                                        PHYSICAL_BIAS_1 = PHYSICAL_BIASLIST[0]
                                        PHYSICAL_GAIN_1 = PHYSICAL_GAINLIST[0]
                                        PHYSICAL_UNIT_1 = PHYSICAL_UNITLIST[0]
                            
                                        LINE_NUMBER_2 =LINE_NUMBERLIST[1]
                                        GAIN_NUMBER_2 = GAIN_NUMBERLIST[1]
                                        PHYSICAL_BIAS_2 =PHYSICAL_BIASLIST[1]
                                        PHYSICAL_GAIN_2 = PHYSICAL_GAINLIST[1]
                                        PHYSICAL_UNIT_2 = PHYSICAL_UNITLIST[1]
                            
                                        LINE_NUMBER_3 = LINE_NUMBERLIST[2]
                                        GAIN_NUMBER_3 = GAIN_NUMBERLIST[2]
                                        PHYSICAL_BIAS_3 = PHYSICAL_BIASLIST[2]
                                        PHYSICAL_GAIN_3 =PHYSICAL_GAINLIST[2]
                                        PHYSICAL_UNIT_3 = PHYSICAL_UNITLIST[2]
                            
                                        LINE_NUMBER_4 = LINE_NUMBERLIST[3]
                                        GAIN_NUMBER_4 = GAIN_NUMBERLIST[3]
                                        PHYSICAL_BIAS_4 = PHYSICAL_BIASLIST[3]
                                        PHYSICAL_GAIN_4 = PHYSICAL_GAINLIST[3]
                                        PHYSICAL_UNIT_4 = PHYSICAL_UNITLIST[3]
                            
                            
                                        ALGORITHM_TYPE = ALGORITHM_TYPE_1+"|"+ALGORITHM_TYPE_2
                                        ALGORITHM_NAME = ALGORITHM_NAME_1+"|"+ALGORITHM_NAME_2
                                        ALGORITHM_ACTIVATION = ALGORITHM_ACTIVATION_1+"|"+ALGORITHM_ACTIVATION_2
                                        BAND_INDEX = BAND_INDEX_1+"|"+BAND_INDEX_2+"|"+BAND_INDEX_3+"|"+BAND_INDEX_4
                                        BAND_OFFSET = BAND_OFFSET_1+"|"+BAND_OFFSET_2+"|"+BAND_OFFSET_3+"|"+BAND_OFFSET_4
                                        SFSC_BEGIN = SFSC_BEGIN_1+"|"+SFSC_BEGIN_2+"|"+SFSC_BEGIN_3+"|"+SFSC_BEGIN_4
                                        SFSC_END = SFSC_END_1+"|"+SFSC_END_2+"|"+SFSC_END_3+"|"+SFSC_END_4
                                        DSR_BEGIN = DSR_BEGIN_1+"|"+DSR_BEGIN_2+"|"+DSR_BEGIN_3+"|"+DSR_BEGIN_4
                                        DSR_END = DSR_END_1+"|"+DSR_END_2+"|"+DSR_END_3+"|"+DSR_END_4
                                        
                                        serverdir = os.path.abspath(f).split("venv")
                                        for ser in os.listdir(serverdir[0]):
                                            if(ser == "public"):
                                                imgpath = os.path.join(serverdir[0],ser)
                                                newPath = os.path.join(imgpath,"MS2A",JOB_ID+'.JPG')
                                                print("Newpath : ", newPath)

                                        if(os.path.exists(os.path.join(imagePath,JOB_ID)+'.JPG')):
                                            shutil.move(os.path.join(imagePath,JOB_ID)+'.JPG',newPath)
                                    else:
                                        print("Start PAN")
                                        for Data_Processing in root.findall('Data_Processing'):
                                            for Processing_Options in Data_Processing.findall('Processing_Options'):
                                                for Correction_Algorithm in Processing_Options.findall('Correction_Algorithm'):
                                                    AL_Type.append(Correction_Algorithm.find('ALGORITHM_TYPE').text)
                                                    AL_Name.append(Correction_Algorithm.find('ALGORITHM_NAME').text)
                                                    AL_Act.append(Correction_Algorithm.find('ALGORITHM_ACTIVATION').text)
                                                    
                                        ALGORITHM_TYPE_1 = AL_Type[0]
                                        ALGORITHM_NAME_1 = AL_Name[0]
                                        ALGORITHM_ACTIVATION_1 = AL_Act[0]
                            
                                        for Data_Strip in root.findall('Data_Strip'):
                                            for Frame_Counters in Data_Strip.findall('Frame_Counters'):
                                                for Band_Counters in Frame_Counters.findall('Band_Counters'):
                                                    BAND_INDEXLIST.append(Band_Counters.find('BAND_INDEX').text)
                                                    BAND_OFFSETLIST.append(Band_Counters.find('BAND_OFFSET').text)
                                                    SFSC_BEGINLIST.append(Band_Counters.find('SFSC_BEGIN').text)
                                                    SFSC_ENDLIST.append(Band_Counters.find('SFSC_END').text)
                                                    DSR_BEGINLIST.append(Band_Counters.find('DSR_BEGIN').text)
                                                    DSR_ENDLIST.append(Band_Counters.find('DSR_END').text)

                                        BAND_INDEX_1 = BAND_INDEXLIST[0]
                                        BAND_OFFSET_1 = BAND_OFFSETLIST[0]
                                        SFSC_BEGIN_1 = SFSC_BEGINLIST[0]
                                        SFSC_END_1 = SFSC_ENDLIST[0]
                                        DSR_BEGIN_1 = DSR_BEGINLIST[0]
                                        DSR_END_1 = DSR_ENDLIST[0]
                            
                            
                                        for Data_Strip in root.findall('Data_Strip'):
                                                for Sensor_Calibration in Data_Strip.findall('Sensor_Calibration'):
                                                    for Calibration in Sensor_Calibration.findall('Calibration'):
                                                        for Band_Parameters in Calibration.findall('Band_Parameters'):
                                                            for Gain_Section_List in Band_Parameters.findall('Gain_Section_List'):
                                                                for Gain_Section in Gain_Section_List.findall('Gain_Section'):
                                                                    LINE_NUMBERLIST.append(Gain_Section.find('LINE_NUMBER').text)
                                                                    GAIN_NUMBERLIST.append(Gain_Section.find('GAIN_NUMBER').text)
                                                                    PHYSICAL_BIASLIST.append(Gain_Section.find('PHYSICAL_BIAS').text)
                                                                    PHYSICAL_GAINLIST.append(Gain_Section.find('PHYSICAL_GAIN').text)
                                                                    PHYSICAL_UNITLIST.append(Gain_Section.find('PHYSICAL_UNIT').text)
                                            
                                        LINE_NUMBER_1 = LINE_NUMBERLIST[0]
                                        GAIN_NUMBER_1 = GAIN_NUMBERLIST[0]
                                        PHYSICAL_BIAS_1 = PHYSICAL_BIASLIST[0]
                                        PHYSICAL_GAIN_1 = PHYSICAL_GAINLIST[0]
                                        PHYSICAL_UNIT_1 = PHYSICAL_UNITLIST[0]
                            
                                            
                                        ALGORITHM_TYPE = ALGORITHM_TYPE_1
                                        ALGORITHM_NAME = ALGORITHM_NAME_1
                                        ALGORITHM_ACTIVATION = ALGORITHM_ACTIVATION_1
                                        BAND_INDEX = BAND_INDEX_1
                                        BAND_OFFSET = BAND_OFFSET_1
                                        SFSC_BEGIN = SFSC_BEGIN_1
                                        SFSC_END = SFSC_END_1
                                        DSR_BEGIN = DSR_BEGIN_1
                                        DSR_END = DSR_END_1
                                        serverdir = os.path.abspath(f).split("venv")
                                        for ser in os.listdir(serverdir[0]):
                                            if(ser == "public"):
                                                imgpath = os.path.join(serverdir[0],ser)
                                                newPath = os.path.join(imgpath,"PAN2A",JOB_ID+'.JPG')
                                                print("Newpath : ", newPath)
                                        if(os.path.exists(os.path.join(imagePath,JOB_ID)+'.JPG')):
                                            shutil.move(os.path.join(imagePath,JOB_ID)+'.JPG',newPath)
                                
                                print("IMAGING_DATE " + IMAGING_DATE )
                                print("IMAGING_TIME " + IMAGING_TIME )
                                print("MISSION " + MISSION )
                                print("INSTRUMENT " + INSTRUMENT )
                                print("INSTRUMENT_INDEX " + INSTRUMENT_INDEX )
                                print("PATH " , PATH )
                                print("ROW " , ROW )
                                print("REVOLUTION_NUMBER " + REVOLUTION_NUMBER )
                                print("ALL : ",SCENE, SCENE_DISPLAY, SOURCE, FULLPATH, DATASET_NAME,
                                PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION, GRID_REFERENCE, SHIFT_VALUE,
                                IMAGING_DATE, IMAGING_TIME, MISSION, MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE,
                                SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK, SATELLITE_INCIDENCE_ANGLE,
                                SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION, REVOLUTION_NUMBER, THEORETICAL_RESOLUTION,
                                GEO_TABLES, HORIZONTAL_CS_TYPE, HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN,
                                JOB_ID, PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL,
                                DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER, NCOLS, NROWS,
                                NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT, PROCESSING_LEVEL, GEOMETRIC_PROCESSING,
                                RADIOMETRIC_PROCESSING, ALGORITHM_TYPE, ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION,
                                DATA_FILE_FORMAT, DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO,
                                BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END, REFERENCE_BAND,
                                REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE, YAW, PITCH, ROLL,
                                CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME, ULXMAP, ULYMAP, XDIM,
                                YDIM, LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,
                                IMAGE)
                                try:                                
                                    shutil.rmtree(os.path.dirname(os.path.realpath(i)))
                                    print("Remove DIM Complete")
                                except Exception as e:
                                    print(e) 
                                dimSelect = findDiminCUF(IMAGING_DATE,time,MISSION,REVOLUTION_NUMBER,IMAGING_MODE)
                                                        
                                if(dimSelect == None):
                                    print("None")
                                else:
                                    CUFID = dimSelect[0][0]
                                    print("CUFID : ", CUFID)
                                    if(PROCESSING_LEVEL == '1A'):
                                        if(IMAGING_MODE == 'MS'):
                                            IMAGE =  'http://127.0.0.1:3001/MS1A/'+JOB_ID+'.JPG'
                                            try:
                                                cur = mysql.connection.cursor()
                                                cur.execute(''' INSERT INTO ms1a(SCENE, SCENE_DISPLAY, SOURCE, FULLPATH,
                                                DATASET_NAME, PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION,
                                                GRID_REFERENCE, SHIFT_VALUE, IMAGING_DATE, IMAGING_TIME, MISSION,
                                                MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE,
                                                SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK,
                                                SATELLITE_INCIDENCE_ANGLE, SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION,
                                                REVOLUTION_NUMBER, THEORETICAL_RESOLUTION, GEO_TABLES, HORIZONTAL_CS_TYPE,
                                                HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN, JOB_ID,
                                                PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL,
                                                DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER,
                                                NCOLS, NROWS, NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT,
                                                PROCESSING_LEVEL, GEOMETRIC_PROCESSING, RADIOMETRIC_PROCESSING, ALGORITHM_TYPE,
                                                ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION, DATA_FILE_FORMAT,
                                                DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO,
                                                BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END,
                                                REFERENCE_BAND, REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE,
                                                YAW, PITCH, ROLL, CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME,
                                                TIE_POINT_CRS_X1, TIE_POINT_CRS_Y1, TIE_POINT_DATA_X1, TIE_POINT_DATA_Y1,
                                                TIE_POINT_CRS_X2, TIE_POINT_CRS_Y2, TIE_POINT_DATA_X2, TIE_POINT_DATA_Y2,
                                                TIE_POINT_CRS_X3, TIE_POINT_CRS_Y3, TIE_POINT_DATA_X3, TIE_POINT_DATA_Y3,
                                                TIE_POINT_CRS_X4, TIE_POINT_CRS_Y4, TIE_POINT_DATA_X4, TIE_POINT_DATA_Y4,
                                                LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,
                                                LINE_NUMBER_2, GAIN_NUMBER_2, PHYSICAL_BIAS_2, PHYSICAL_GAIN_2, PHYSICAL_UNIT_2,
                                                LINE_NUMBER_3, GAIN_NUMBER_3, PHYSICAL_BIAS_3, PHYSICAL_GAIN_3, PHYSICAL_UNIT_3,
                                                LINE_NUMBER_4, GAIN_NUMBER_4, PHYSICAL_BIAS_4, PHYSICAL_GAIN_4, PHYSICAL_UNIT_4,IMAGE
                                                )VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
                                                ,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
                                                ,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                                                %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)  ''', (SCENE,SCENE_DISPLAY,SOURCE, FULLPATH,
                                                DATASET_NAME, PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION,
                                                GRID_REFERENCE, SHIFT_VALUE, IMAGING_DATE, IMAGING_TIME, MISSION,
                                                MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE,
                                                SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK,
                                                SATELLITE_INCIDENCE_ANGLE, SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION,
                                                REVOLUTION_NUMBER, THEORETICAL_RESOLUTION, GEO_TABLES, HORIZONTAL_CS_TYPE,
                                                HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN, JOB_ID,
                                                PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL,
                                                DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER,
                                                NCOLS, NROWS, NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT,
                                                PROCESSING_LEVEL, GEOMETRIC_PROCESSING, RADIOMETRIC_PROCESSING, ALGORITHM_TYPE,
                                                ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION, DATA_FILE_FORMAT,
                                                DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO,
                                                BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END,
                                                REFERENCE_BAND, REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE,
                                                YAW, PITCH, ROLL, CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME,
                                                TIE_POINT_CRS_X1, TIE_POINT_CRS_Y1, TIE_POINT_DATA_X1, TIE_POINT_DATA_Y1,
                                                TIE_POINT_CRS_X2, TIE_POINT_CRS_Y2, TIE_POINT_DATA_X2, TIE_POINT_DATA_Y2,
                                                TIE_POINT_CRS_X3, TIE_POINT_CRS_Y3, TIE_POINT_DATA_X3, TIE_POINT_DATA_Y3,
                                                TIE_POINT_CRS_X4, TIE_POINT_CRS_Y4, TIE_POINT_DATA_X4, TIE_POINT_DATA_Y4,
                                                LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,
                                                LINE_NUMBER_2, GAIN_NUMBER_2, PHYSICAL_BIAS_2, PHYSICAL_GAIN_2, PHYSICAL_UNIT_2,
                                                LINE_NUMBER_3, GAIN_NUMBER_3, PHYSICAL_BIAS_3, PHYSICAL_GAIN_3, PHYSICAL_UNIT_3,
                                                LINE_NUMBER_4, GAIN_NUMBER_4, PHYSICAL_BIAS_4, PHYSICAL_GAIN_4, PHYSICAL_UNIT_4,
                                                IMAGE))
                                                mysql.connection.commit()
                                                data = cur.lastrowid
                                                cur.close()
                                            except Exception as e:
                                                print("cannot upload")
                                                print(e)
                                            for ser in os.listdir(serverdir[0]):
                                                if(ser == "public"):
                                                    file = os.path.join(serverdir[0],ser)
                                                    newPath = os.path.join(file,"files",f)
                                                    print("Newpath : ", newPath)
                                            
                                        elif(IMAGING_MODE == 'PAN'):
                                            IMAGE =  'http://127.0.0.1:3001/PAN1A/'+JOB_ID+'.JPG'
                                            try:
                                                cur = mysql.connection.cursor()
                                                cur.execute(''' INSERT INTO pan1a(SCENE, SCENE_DISPLAY, SOURCE, FULLPATH,
                                                DATASET_NAME, PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION,
                                                GRID_REFERENCE, SHIFT_VALUE, IMAGING_DATE, IMAGING_TIME, MISSION,
                                                MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE,
                                                SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK,
                                                SATELLITE_INCIDENCE_ANGLE, SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION,
                                                REVOLUTION_NUMBER, THEORETICAL_RESOLUTION, GEO_TABLES, HORIZONTAL_CS_TYPE,
                                                HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN, JOB_ID,
                                                PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL,
                                                DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER,
                                                NCOLS, NROWS, NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT,
                                                PROCESSING_LEVEL, GEOMETRIC_PROCESSING, RADIOMETRIC_PROCESSING, ALGORITHM_TYPE,
                                                ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION, DATA_FILE_FORMAT,
                                                DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO,
                                                BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END,
                                                REFERENCE_BAND, REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE,
                                                YAW, PITCH, ROLL, CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME,
                                                TIE_POINT_CRS_X1, TIE_POINT_CRS_Y1, TIE_POINT_DATA_X1, TIE_POINT_DATA_Y1,
                                                TIE_POINT_CRS_X2, TIE_POINT_CRS_Y2, TIE_POINT_DATA_X2, TIE_POINT_DATA_Y2,
                                                TIE_POINT_CRS_X3, TIE_POINT_CRS_Y3, TIE_POINT_DATA_X3, TIE_POINT_DATA_Y3,
                                                TIE_POINT_CRS_X4, TIE_POINT_CRS_Y4, TIE_POINT_DATA_X4, TIE_POINT_DATA_Y4,
                                                LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,IMAGE
                                                )VALUES (
                                                %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
                                                ,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                                                %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
                                                ,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                                                %s,%s)  ''', (SCENE, SCENE_DISPLAY, SOURCE, FULLPATH,
                                                DATASET_NAME, PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION,
                                                GRID_REFERENCE, SHIFT_VALUE, IMAGING_DATE, IMAGING_TIME, MISSION,
                                                MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE,
                                                SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK,
                                                SATELLITE_INCIDENCE_ANGLE, SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION,
                                                REVOLUTION_NUMBER, THEORETICAL_RESOLUTION, GEO_TABLES, HORIZONTAL_CS_TYPE,
                                                HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN, JOB_ID,
                                                PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL,
                                                DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER,
                                                NCOLS, NROWS, NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT,
                                                PROCESSING_LEVEL, GEOMETRIC_PROCESSING, RADIOMETRIC_PROCESSING, ALGORITHM_TYPE,
                                                ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION, DATA_FILE_FORMAT,
                                                DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO,
                                                BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END,
                                                REFERENCE_BAND, REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE,
                                                YAW, PITCH, ROLL, CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME,
                                                TIE_POINT_CRS_X1, TIE_POINT_CRS_Y1, TIE_POINT_DATA_X1, TIE_POINT_DATA_Y1,
                                                TIE_POINT_CRS_X2, TIE_POINT_CRS_Y2, TIE_POINT_DATA_X2, TIE_POINT_DATA_Y2,
                                                TIE_POINT_CRS_X3, TIE_POINT_CRS_Y3, TIE_POINT_DATA_X3, TIE_POINT_DATA_Y3,
                                                TIE_POINT_CRS_X4, TIE_POINT_CRS_Y4, TIE_POINT_DATA_X4, TIE_POINT_DATA_Y4,
                                                LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,
                                                IMAGE))
                                                mysql.connection.commit()
                                                data = cur.lastrowid
                                                cur.close()
                                            except Exception as e:
                                                print("cannot upload")
                                                print(e)
                                            for ser in os.listdir(serverdir[0]):
                                                if(ser == "public"):
                                                    file = os.path.join(serverdir[0],ser)
                                                    newPath = os.path.join(file,"files",f)
                                                    print("Newpath : ", newPath)
                                            
                                    elif(PROCESSING_LEVEL == '2A'):
                                        if(IMAGING_MODE == 'MS'):
                                            IMAGE =  'http://127.0.0.1:3001/MS2A/'+JOB_ID+'.JPG'
                                            try:
                                                cur = mysql.connection.cursor()
                                                cur.execute(''' INSERT INTO ms2a( SCENE, SCENE_DISPLAY, SOURCE, FULLPATH, DATASET_NAME,
                                                PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION, GRID_REFERENCE, SHIFT_VALUE,
                                                IMAGING_DATE, IMAGING_TIME, MISSION, MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE,
                                                SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK, SATELLITE_INCIDENCE_ANGLE,
                                                SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION, REVOLUTION_NUMBER, THEORETICAL_RESOLUTION,
                                                GEO_TABLES, HORIZONTAL_CS_TYPE, HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN,
                                                JOB_ID, PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL,
                                                DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER, NCOLS, NROWS,
                                                NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT, PROCESSING_LEVEL, GEOMETRIC_PROCESSING,
                                                RADIOMETRIC_PROCESSING, ALGORITHM_TYPE, ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION,
                                                DATA_FILE_FORMAT, DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO,
                                                BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END, REFERENCE_BAND,
                                                REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE, YAW, PITCH, ROLL,
                                                CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME, ULXMAP, ULYMAP, XDIM,
                                                YDIM, LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,
                                                LINE_NUMBER_2, GAIN_NUMBER_2, PHYSICAL_BIAS_2, PHYSICAL_GAIN_2, PHYSICAL_UNIT_2,
                                                LINE_NUMBER_3, GAIN_NUMBER_3, PHYSICAL_BIAS_3, PHYSICAL_GAIN_3, PHYSICAL_UNIT_3,
                                                LINE_NUMBER_4, GAIN_NUMBER_4, PHYSICAL_BIAS_4, PHYSICAL_GAIN_4, PHYSICAL_UNIT_4,IMAGE
                                                ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
                                                ,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
                                                ,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)''', 
                                                ( SCENE, SCENE_DISPLAY, SOURCE, FULLPATH, DATASET_NAME,
                                                    PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION, GRID_REFERENCE, SHIFT_VALUE,
                                                    IMAGING_DATE, IMAGING_TIME, MISSION, MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE,
                                                    SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK, SATELLITE_INCIDENCE_ANGLE,
                                                    SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION, REVOLUTION_NUMBER, THEORETICAL_RESOLUTION,
                                                    GEO_TABLES, HORIZONTAL_CS_TYPE, HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN,
                                                    JOB_ID, PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL,
                                                    DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER, NCOLS, NROWS,
                                                    NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT, PROCESSING_LEVEL, GEOMETRIC_PROCESSING,
                                                    RADIOMETRIC_PROCESSING, ALGORITHM_TYPE, ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION,
                                                    DATA_FILE_FORMAT, DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO,
                                                    BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END, REFERENCE_BAND,
                                                    REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE, YAW, PITCH, ROLL,
                                                    CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME, ULXMAP, ULYMAP, XDIM,
                                                    YDIM, LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,
                                                    LINE_NUMBER_2, GAIN_NUMBER_2, PHYSICAL_BIAS_2, PHYSICAL_GAIN_2, PHYSICAL_UNIT_2,
                                                    LINE_NUMBER_3, GAIN_NUMBER_3, PHYSICAL_BIAS_3, PHYSICAL_GAIN_3, PHYSICAL_UNIT_3,
                                                    LINE_NUMBER_4, GAIN_NUMBER_4, PHYSICAL_BIAS_4, PHYSICAL_GAIN_4, PHYSICAL_UNIT_4,
                                                    IMAGE))
                                                
                                                mysql.connection.commit()
                                                data = cur.lastrowid
                                                cur.close()
                                            except Exception as e:
                                                print("cannot upload")
                                                print(e)
                                            for ser in os.listdir(serverdir[0]):
                                                if(ser == "public"):
                                                    file = os.path.join(serverdir[0],ser)
                                                    newPath = os.path.join(file,"files",f)
                                                    print("Newpath : ", newPath)
                                            
                                        elif(IMAGING_MODE == 'PAN'):
                                            IMAGE =  'http://127.0.0.1:3001/PAN2A/'+JOB_ID+'.JPG'
                                            try:
                                                cur = mysql.connection.cursor()
                                                cur.execute(''' INSERT INTO pan2a( SCENE, SCENE_DISPLAY, SOURCE, FULLPATH, DATASET_NAME,
                                                PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION, GRID_REFERENCE, SHIFT_VALUE,
                                                IMAGING_DATE, IMAGING_TIME, MISSION, MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE,
                                                SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK, SATELLITE_INCIDENCE_ANGLE,
                                                SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION, REVOLUTION_NUMBER, THEORETICAL_RESOLUTION,
                                                GEO_TABLES, HORIZONTAL_CS_TYPE, HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN,
                                                JOB_ID, PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL,
                                                DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER, NCOLS, NROWS,
                                                NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT, PROCESSING_LEVEL, GEOMETRIC_PROCESSING,
                                                RADIOMETRIC_PROCESSING, ALGORITHM_TYPE, ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION,
                                                DATA_FILE_FORMAT, DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO,
                                                BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END, REFERENCE_BAND,
                                                REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE, YAW, PITCH, ROLL,
                                                CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME, ULXMAP, ULYMAP, XDIM,
                                                YDIM, LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,IMAGE
                                                ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) ''', 
                                                ( SCENE, SCENE_DISPLAY, SOURCE, FULLPATH, DATASET_NAME,
                                                    PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION, GRID_REFERENCE, SHIFT_VALUE,
                                                    IMAGING_DATE, IMAGING_TIME, MISSION, MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE,
                                                    SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK, SATELLITE_INCIDENCE_ANGLE,
                                                    SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION, REVOLUTION_NUMBER, THEORETICAL_RESOLUTION,
                                                    GEO_TABLES, HORIZONTAL_CS_TYPE, HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN,
                                                    JOB_ID, PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL,
                                                    DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER, NCOLS, NROWS,
                                                    NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT, PROCESSING_LEVEL, GEOMETRIC_PROCESSING,
                                                    RADIOMETRIC_PROCESSING, ALGORITHM_TYPE, ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION,
                                                    DATA_FILE_FORMAT, DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO,
                                                    BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END, REFERENCE_BAND,
                                                    REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE, YAW, PITCH, ROLL,
                                                    CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME, ULXMAP, ULYMAP, XDIM,
                                                    YDIM, LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,
                                                    IMAGE))
                                                data = cur.lastrowid
                                                mysql.connection.commit()
                                               
                                                cur.close()
                                            except Exception as e:
                                                print("cannot upload")
                                                print(e)
                                            for ser in os.listdir(serverdir[0]):
                                                if(ser == "public"):
                                                    fileser = os.path.join(serverdir[0],ser)
                                                    newPath = os.path.join(fileser,"files",f)
                                                    print("Newpath : ", newPath)
                                    print(data)
                                    ######
                                    if(IMAGING_MODE == 'MS' and PROCESSING_LEVEL == '1A'):
                                        choice =  'MS1A_ID'
                                        col_image  = 'MS1AIMAGE'
                                    elif(IMAGING_MODE == 'MS' and PROCESSING_LEVEL == '2A'):
                                        choice =  'MS2A_ID'
                                        col_image  = 'MS2AIMAGE'
                                    elif(IMAGING_MODE == 'PAN' and PROCESSING_LEVEL == '1A'):
                                        choice =  'PAN1A_ID'
                                        col_image  = 'PAN1AIMAGE'
                                    elif(IMAGING_MODE == 'PAN' and PROCESSING_LEVEL == '2A'):
                                        choice =  'PAN2A_ID'
                                        col_image  = 'PAN2AIMAGE'
                                    try:
                                        cur = mysql.connection.cursor()
                                        cur.execute(''' 
                                                    UPDATE all_image_order SET '''+choice+''' = '''+str(data)+''' , '''+col_image+''' = ' '''+IMAGE+''' ' WHERE ID = '''+str(CUFID)+'''
                                                    '''
                                        )
                                        mysql.connection.commit()
                                        cur.close()
                                    except Exception as e:
                                        print("cannot upload")
                                        print(e)

                                            
                            elif(i.endswith('PREVIEW.JPG')):
                                zip.extract(i)
                    
                    try:
                        if(os.path.exists(os.path.join('./ziptest',f))):
                            shutil.move(os.path.join('./ziptest',f),newPath)
                    except Exception as e:
                        print(e)
                        
                
        try:
            
            shutil.rmtree('./ziptest')
            print("Remove ziptest complete")
            resp = make_response("finish")            
            resp.headers['Access-Control-Allow-Origin'] = '*'
        except Exception as e:
            print(e)
    except Exception as e:
        print(e)
    
    return resp

def findDiminCUF(IMAGING_DATE,IMAGING_TIME,MISSION,REVOLUTION_NUMBER,IMAGING_MODE):

    cursor = mysql.connection.cursor()

    query_string = '''SELECt * FROM  all_image_order WHERE DATE = %s AND TIME = %s AND MISSION = %s AND REVOLUTION_NUMBER = %s  AND MODE = %s '''
    cursor.execute(query_string, (IMAGING_DATE,IMAGING_TIME,MISSION,REVOLUTION_NUMBER,IMAGING_MODE))

    data = cursor.fetchall()
    if(data == ()):
        data = None
    cursor.close()

    return data

# def InsertDIMtoCUF(CUFID,SCENE, SCENE_DISPLAY, SOURCE, FULLPATH, DATASET_NAME,
#                     PROLINE_NAME, SOURCE_TYPE, SOURCE_ID, SOURCE_DESCRIPTION, GRID_REFERENCE, SHIFT_VALUE,
#                     IMAGING_DATE, IMAGING_TIME, MISSION, MISSION_INDEX, INSTRUMENT, INSTRUMENT_INDEX, IMAGING_MODE,
#                     SCENE_PROCESSING_LEVEL, VIEWING_ANGLE_ALONG_TRACK, VIEWING_ANGLE_ACROSS_TRACK, SATELLITE_INCIDENCE_ANGLE,
#                     SATELLITE_AZIMUTH_ANGLE, SUN_AZIMUTH, SUN_ELEVATION, REVOLUTION_NUMBER, THEORETICAL_RESOLUTION,
#                     GEO_TABLES, HORIZONTAL_CS_TYPE, HORIZONTAL_CS_CODE, HORIZONTAL_CS_NAME, RASTER_CS_TYPE, PIXEL_ORIGIN,
#                     JOB_ID, PRODUCT_INFO, PRODUCT_TYPE, DATASET_PRODUCER_NAME, DATASET_PRODUCER_URL,
#                     DATASET_PRODUCTION_DATE, SOFTWARE_NAME, SOFTWARE_VERSION, PROCESSING_CENTER, NCOLS, NROWS,
#                     NBANDS, NBITS, DATA_TYPE, BYTEORDER, BANDS_LAYOUT, PROCESSING_LEVEL, GEOMETRIC_PROCESSING,
#                     RADIOMETRIC_PROCESSING, ALGORITHM_TYPE, ALGORITHM_NAME, ALGORITHM_ACTIVATION, DATA_FILE_ORGANISATION,
#                     DATA_FILE_FORMAT, DATA_FILE_PATH, DATA_STRIP_ID, LCNT, IGPST, FILE_NAME, COMPRESSION_RATIO,
#                     BAND_INDEX, BAND_OFFSET, SFSC_BEGIN, SFSC_END, DSR_BEGIN, DSR_END, REFERENCE_BAND,
#                     REFERENCE_TIME, REFERENCE_LINE, LINE_PERIOD, SATELLITE_ALTITUDE, YAW, PITCH, ROLL,
#                     CALIBRATION_TYPE, CALIBRATION_VALIDITY, CALIBRATION_FILENAME, ULXMAP, ULYMAP, XDIM,
#                     YDIM, LINE_NUMBER_1, GAIN_NUMBER_1, PHYSICAL_BIAS_1, PHYSICAL_GAIN_1, PHYSICAL_UNIT_1,
#                     IMAGE)