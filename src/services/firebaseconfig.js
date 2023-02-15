require('dotenv').config()

module.exports = {
    type: process.env.FIRETYPE,
    project_id: process.env.FIREPROJECTID,
    private_key_id: process.env.FIREPRIVATEKEYID,
    private_key: process.env.FIREPRIVATEKEY,
    client_email: process.env.FIRECLIENTEMAIL,
    client_id: process.env.FIRECLIENTID,
    auth_uri: process.env.FIREAUTHURL,
    token_uri: process.env.FIRETOKENURL,
    auth_provider_x509_cert_url: process.env.AUTHPROVIDERX509URL,
    client_x509_cert_url: process.env.CLIENTX509CERTURL
}