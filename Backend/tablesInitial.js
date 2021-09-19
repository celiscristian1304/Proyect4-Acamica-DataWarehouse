const user = {
    createTable:
    `CREATE TABLE IF NOT EXISTS user (
        idUser INT NOT NULL AUTO_INCREMENT,
        user VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        profile VARCHAR(255) NOT NULL,
        rol VARCHAR(5) NOT NULL,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY (idUser)
        )`,
    setValues:
    `INSERT INTO user (user,name,lastName,email,profile,rol,password)
    VALUES ("admin","Cristian","Celis","celiscristian1304@gmail.com","Gerente","admin","U2FsdGVkX181coQ30xsAuWhnzmd/08PVxTbJkFtSnCw="),
    ("lcruz13","Laura","Cruz","lcruz13@gmail.com","Líder","basic","U2FsdGVkX197iiNyzMJh9ny1et4aE26v5TLij/Twczc="),
    ("lucia86","Lucia","Celis","luciacelis86@gmail.com","Analista de marketing","basic","U2FsdGVkX18U2nkUMo5v5yobCnvBoUzmiRLtGVyjySw="),
    ("fleon20","Fabian","León","fleon20@gmail.com","Inteligencia de negocio","basic","U2FsdGVkX1/Tv4Ca2tE9cgxB30uHaNqzkI303ykEnuU=")`
};

const region = {
    createTable: 
    `CREATE TABLE IF NOT EXISTS region (
        idRegion INT NOT NULL AUTO_INCREMENT,
        region VARCHAR(255) NOT NULL,
        PRIMARY KEY (idRegion)
        )`,
    setValues:
    `INSERT INTO region (region)
    VALUES ("Sudamérica"),
    ("Norteamérica")`
};

const country = {
    createTable:
    `CREATE TABLE IF NOT EXISTS country (
        idCountry INT NOT NULL AUTO_INCREMENT,
        idRegion INT NOT NULL,
        country VARCHAR(255) NOT NULL,
        PRIMARY KEY (idCountry),
        FOREIGN KEY (idRegion) REFERENCES region (idRegion)
    )`,
    setValues:
    `INSERT INTO country (idRegion,country)
    VALUES (1,"Argentina"),
    (1,"Colombia"),
    (1,"Chile"),
    (1,"Uruguay"),
    (2,"México"),
    (2,"Estados Unidos")`
};

const city = {
    createTable:
    `CREATE TABLE IF NOT EXISTS city (
        idCity INT NOT NULL AUTO_INCREMENT,
        idCountry INT NOT NULL,
        city VARCHAR(255) NOT NULL,
        PRIMARY KEY (idCity),
        FOREIGN KEY (idCountry) REFERENCES country (idCountry)
    )`,
    setValues:
    `INSERT INTO city (idCountry,city)
    VALUES (1,"Buenos Aires"),
    (1,"Córdoba"),
    (2,"Bogotá"),
    (2,"Cúcuta"),
    (2,"Medellín"),
    (3,"Atacama"),
    (3,"Santiago"),
    (3,"Valparaíso"),
    (4,"Canelones"),
    (4,"Maldonado"),
    (4,"Montevideo"),
    (5,"Ciudad de México"),
    (5,"Tijuana"),
    (6,"Florida"),
    (6,"Texas")`
};

const company = {
    createTable:
    `CREATE TABLE IF NOT EXISTS company (
        idCompany INT NOT NULL AUTO_INCREMENT,
        idCity INT NOT NULL,
        company VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        PRIMARY KEY (idCompany),
        FOREIGN KEY (idCity) REFERENCES city (idCity)
    )`,
    setValues:
    `INSERT INTO company (idCity,company,address,email,phone)
    VALUES (1,"Ecom Experts","Beauchef 899, C1424 CABA","ventas@ecomexperts.com","91122555159"),
    (1,"Acámica","Humboldt 1967, C1414 CTU","admisiones@acamica.com","91123565158"),
    (5,"Celsia","CARRERA 43 A 1 A SUR 143 PISO 5","contacto@celsia.com","3266600"),
    (3,"Confipetrol","CARRERA 15 98 26 OF 401","arecursos@confipetrol.com","4232949"),
    (7,"Instacrops","Barros Borgoño 160, office Nº602","contacto@instacrops.com","988342646"),
    (7,"Clader","zona centro unión literaria 2015 nuñoa","contacto@calder.cl","973880973"),
    (9,"Aletheia","camino de las estrellas 1298 bis esq fransisco bonillo","formacion@aletheia.com","094822650"),
    (11,"Mag","wilson ferreira aldunate 1342/202","arquitectura@mag.arg","29042060"),
    (12,"2realpeople Solutions","Tlaxcala 177, Int. 604, Sexto Piso","ventas@2rps.mx","5541964848"),
    (12,"Zuma Ti","Av. Insurgentes Sur 1647, Piso 4","contacto@zuma-ti.com.mx","67259009")`
};

const channel = {
    createTable:
    `CREATE TABLE IF NOT EXISTS channel (
        idChannel INT NOT NULL AUTO_INCREMENT,
        channel VARCHAR(9) NOT NULL,
        dataType VARCHAR(6) NOT NULL COMMENT 'Número or Link',
        PRIMARY KEY (idChannel)
    )`,
    setValues:
    `INSERT INTO channel (channel,dataType)
    VALUES ("Teléfono","Número"),
    ("Whatsapp","Número"),
    ("Facebook","Link"),
    ("Instagram","Link"),
    ("Linkedin","Link")`
};

const contact = {
    createTable:
    `CREATE TABLE IF NOT EXISTS contact (
        idContact INT NOT NULL AUTO_INCREMENT,
        idCompany INT NOT NULL,
        idCity INT,
        name VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        position VARCHAR(255) NOT NULL,
        interest int(3) NOT NULL,
        PRIMARY KEY (idContact),
        FOREIGN KEY (idCompany) REFERENCES company (idCompany),
        FOREIGN KEY (idCity) REFERENCES city (idCity)
    )`,
    setValues:
    `INSERT INTO contact (idCompany,idCity,name,lastName,email,position,interest,address)
    VALUES (1,1,"Juan Ignacio","Fernández Fernández","jignacio@ecomexperts.com","Analista De Negocio","25","Calle 123"),
    (1,1,"María Florencia","Pérez Sánchez","mflorencia@ecomexperts.com","Analista Ux","25","Calle 123"),
    (1,1,"Stella Maris","González García","smaris@ecomexperts.com","Gerente De Mercadeo","25","Calle 123"),
    (2,1,"Juan José","López Díaz","jjose@acamica.com","Director de Ti","50","Calle 456"),
    (2,1,"Luis Alberto","Martínez Pérez","lalberto@acamica.com","Líder De Desarrollo","75","Calle 789"),
    (2,1,"María Laura","Gómez Rodríguez","mlaura@acamica.com","Administrador De País","0","Calle 101"),
    (3,5,"José de Jesús","Espinoza García","jjesus@celsia.com","Ingeniero De Hidroeléctricas","0","Calle 101"),
    (3,5,"Luz Marina","González González","lmarina@celsia.com","Gerente De Contabilidad","25","Calle 123"),
    (3,5,"José Angel","Celis Pagnan","jangel@celsia.com","Gerente De Logística","0","Calle 101"),
    (4,3,"Mayra Sofía","Muñoz Ramirez","msofia@confipetrol.com","Ingeniera Ambiental","100","Calle 102"),
    (4,3,"Fabián Alejandro","León Alméciga","fleon@confipetrol.com","Inteligencia De Negocio","100","Calle 102"),
    (4,3,"Angela","Parra Gutierres","aparra@confipetrol.com","Ingeniera Química","50","Calle 456"),
    (5,7,"Ema Isidora","Contreras Silva","econtreras@instacrops.com","Ingeniera De Alimentos","75","Calle 789"),
    (5,7,"Valentina Sofía","Torres Espinoza","vtorres@instacrops.com","Agropecuaria","25","Calle 123"),
    (5,7,"José Matías","Castro Cortes","jcastro@instacrops.com","Ganadero","0","Calle 101"),
    (6,7,"Lucas Alonso","Flores Castillo","lflores@calder.cl","Ingeniero Térmico","0","Calle 101"),
    (6,7,"Amanda","Morales Sepulveda","amorales@calder.cl","Arquitecta Térmica","100","Calle 102"),
    (6,7,"Julián Mateo","Vidal Ruiz","jvidal@calder.cl","Especialista Térmico","75","Calle 789"),
    (7,9,"Martina Valentina","Castro Sanchez","mcastro@aletheia.com","Scrum Master","50","Calle 456"),
    (7,9,"Benjamín","Santos Reyes","bsantos@aletheia.com","Product Owner","25","Calle 123"),
    (7,9,"Juan Mateo","Dominguez Dos Santos","jdominguez@aletheia.com","It support","25","Calle 123"),
    (8,11,"Carlos Alberto","García Perez","cgarcia@mag.arg","Interno de construcción","25","Calle 123"),
    (8,11,"Luis Alberto","Sosa Torres","lsosa@mag.arg","Arquitecto en jefe","50","Calle 456"),
    (8,11,"Nicólas","Acosta Suarez","nacosta@mag.arg","Planimetrista","50","Calle 456"),
    (9,12,"María Guadalupe","López Martínez","mlopez@2rps.mx","Ingeniera mecatrónica","0","Calle 101"),
    (9,12,"Miguel Angel","Hernández González","mhernandez@2rps.mx","Analista de datos","100","Calle 102"),
    (9,12,"Jesús Antonio","Cruz Florez","jcruz@2rps.mx","Técnico en soldadura","25","Calle 123"),
    (10,12,"Eduardo Miguel","Gómez Perez","egomez@zuma-ti.com.mx","Consultor Líder","100","Calle 102"),
    (10,12,"Juana","Hernández Hernández","jhernandez@zuma-ti.com.mx","Desarrolladora de talento","100","Calle 102"),
    (10,12,"Fransisco","Hernández Hernández","fhernandez@zuma-ti.com.mx","Contador","25","Calle 123")`
};

const contactChannel = {
    createTable:
    `CREATE TABLE IF NOT EXISTS contactChannel (
        idContactChannel INT NOT NULL AUTO_INCREMENT,
        idContact INT NULL,
        idChannel INT NULL,
        data VARCHAR(255) NULL,
        preference VARCHAR(15) NULL,
        PRIMARY KEY (idContactChannel),
        FOREIGN KEY (idContact) REFERENCES contact (idContact),
        FOREIGN KEY (idChannel) REFERENCES channel (idChannel)
    )`,
    setValues:
    `INSERT INTO contactChannel (idContact,idChannel,data,preference)
    VALUES (1,1,"12345678","Canal favorito"),
    (1,2,"","Sin preferencia"),
    (1,3,"","Sin preferencia"),
    (1,4,"","Sin preferencia"),
    (1,5,"","Sin preferencia"),
    (2,1,"","Sin preferencia"),
    (2,2,"","Sin preferencia"),
    (2,3,"","Sin preferencia"),
    (2,4,"mflorencia","No molestar"),
    (2,5,"mariaflorencia","No molestar"),
    (3,1,"","Sin preferencia"),
    (3,2,"","Sin preferencia"),
    (3,3,"sgonzalez","No molestar"),
    (3,4,"sgonzalez","Canal favorito"),
    (3,5,"stellagonzalez","Canal favorito"),
    (4,1,"15189756","No molestar"),
    (4,2,"15791561","No molestar"),
    (4,3,"jlopez","Canal favorito"),
    (4,4,"jlopez","Canal favorito"),
    (4,5,"","Sin preferencia"),
    (5,1,"15036139","Canal favorito"),
    (5,2,"15239548","Canal favorito"),
    (5,3,"lmartinez","Canal favorito"),
    (5,4,"lmartinez","Canal favorito"),
    (5,5,"luismartinez","No molestar"),
    (6,1,"15327815","No molestar"),
    (6,2,"15154982","Canal favorito"),
    (6,3,"mgomez","Canal favorito"),
    (6,4,"","Sin preferencia"),
    (6,5,"mariagomez","No molestar"),
    (7,1,"15929149","No molestar"),
    (7,2,"15929149","Canal favorito"),
    (7,3,"jespinoza","Canal favorito"),
    (7,4,"","Sin preferencia"),
    (7,5,"","Sin preferencia"),
    (8,1,"15513393","Canal favorito"),
    (8,2,"15992312","No molestar"),
    (8,3,"","Sin preferencia"),
    (8,4,"","Sin preferencia"),
    (8,5,"","Sin preferencia"),
    (9,1,"","Sin preferencia"),
    (9,2,"","Sin preferencia"),
    (9,3,"","Sin preferencia"),
    (9,4,"","Sin preferencia"),
    (9,5,"josecelis","No molestar"),
    (10,1,"","Sin preferencia"),
    (10,2,"","Sin preferencia"),
    (10,3,"","Sin preferencia"),
    (10,4,"","Sin preferencia"),
    (10,5,"","Sin preferencia"),
    (11,1,"","Sin preferencia"),
    (11,2,"","Sin preferencia"),
    (11,3,"","Sin preferencia"),
    (11,4,"fleon","Canal favorito"),
    (11,5,"","Sin preferencia"),
    (12,1,"15536746","Canal favorito"),
    (12,2,"15342018","No molestar"),
    (12,3,"","Sin preferencia"),
    (12,4,"","Sin preferencia"),
    (12,5,"","Sin preferencia"),
    (13,1,"","Sin preferencia"),
    (13,2,"15499574","No molestar"),
    (13,3,"econtreras","Canal favorito"),
    (13,4,"","Sin preferencia"),
    (13,5,"emacontreras","Canal favorito"),
    (14,1,"15228317","No molestar"),
    (14,2,"15228317","No molestar"),
    (14,3,"vtorres","Canal favorito"),
    (14,4,"vtorres","No molestar"),
    (14,5,"","Sin preferencia"),
    (15,1,"15881207","Canal favorito"),
    (15,2,"15575804","No molestar"),
    (15,3,"jcastro","Canal favorito"),
    (15,4,"jcastro","No molestar"),
    (15,5,"josecastro","No molestar"),
    (16,1,"15443841","Canal favorito"),
    (16,2,"15253322","Canal favorito"),
    (16,3,"lflores","No molestar"),
    (16,4,"lflores","Canal favorito"),
    (16,5,"","Sin preferencia"),
    (17,1,"15679200","No molestar"),
    (17,2,"15679200","Canal favorito"),
    (17,3,"","Sin preferencia"),
    (17,4,"","Sin preferencia"),
    (17,5,"amandamorales","No molestar"),
    (18,1,"","Sin preferencia"),
    (18,2,"","Sin preferencia"),
    (18,3,"","Sin preferencia"),
    (18,4,"","Sin preferencia"),
    (18,5,"","Sin preferencia"),
    (19,1,"","Sin preferencia"),
    (19,2,"","Sin preferencia"),
    (19,3,"","Sin preferencia"),
    (19,4,"","Sin preferencia"),
    (19,5,"","Sin preferencia"),
    (20,1,"","Sin preferencia"),
    (20,2,"","Sin preferencia"),
    (20,3,"","Sin preferencia"),
    (20,4,"","Sin preferencia"),
    (20,5,"","Sin preferencia"),
    (21,1,"","Sin preferencia"),
    (21,2,"","Sin preferencia"),
    (21,3,"","Sin preferencia"),
    (21,4,"","Sin preferencia"),
    (21,5,"","Sin preferencia"),
    (22,1,"","Sin preferencia"),
    (22,2,"","Sin preferencia"),
    (22,3,"","Sin preferencia"),
    (22,4,"","Sin preferencia"),
    (22,5,"","Sin preferencia"),
    (23,1,"","Sin preferencia"),
    (23,2,"","Sin preferencia"),
    (23,3,"","Sin preferencia"),
    (23,4,"","Sin preferencia"),
    (23,5,"","Sin preferencia"),
    (24,1,"","Sin preferencia"),
    (24,2,"","Sin preferencia"),
    (24,3,"","Sin preferencia"),
    (24,4,"","Sin preferencia"),
    (24,5,"","Sin preferencia"),
    (25,1,"","Sin preferencia"),
    (25,2,"","Sin preferencia"),
    (25,3,"","Sin preferencia"),
    (25,4,"","Sin preferencia"),
    (25,5,"","Sin preferencia"),
    (26,1,"","Sin preferencia"),
    (26,2,"","Sin preferencia"),
    (26,3,"","Sin preferencia"),
    (26,4,"","Sin preferencia"),
    (26,5,"","Sin preferencia"),
    (27,1,"","Sin preferencia"),
    (27,2,"","Sin preferencia"),
    (27,3,"","Sin preferencia"),
    (27,4,"","Sin preferencia"),
    (27,5,"","Sin preferencia"),
    (28,1,"","Sin preferencia"),
    (28,2,"","Sin preferencia"),
    (28,3,"","Sin preferencia"),
    (28,4,"","Sin preferencia"),
    (28,5,"","Sin preferencia"),
    (29,1,"","Sin preferencia"),
    (29,2,"","Sin preferencia"),
    (29,3,"","Sin preferencia"),
    (29,4,"","Sin preferencia"),
    (29,5,"","Sin preferencia"),
    (30,1,"","Sin preferencia"),
    (30,2,"","Sin preferencia"),
    (30,3,"","Sin preferencia"),
    (30,4,"","Sin preferencia"),
    (30,5,"","Sin preferencia")`
};

tablesInitial = {user,region,country,city,company,channel,contact,contactChannel};
module.exports = tablesInitial;