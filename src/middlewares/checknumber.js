const CheckEnteredNumber = (req, res, next) => {
    const number = req.body.number;
    const substrings = [ "33", "50",  "77", "88", "90", "91", "93", "94", "95", "97", "99" ];
    const prefixCode = number.slice(3, 5);
    const validNumber = /^998\d{9}$/;

    // check if the reciever number is a valid format
    if (!validNumber.test(number)) {
        return res.status(400).send({ error: 'Invalid number format, it should start with 998 and followed by 7 digits' });
    }

    // check if reciever number's MNC is valid format
    if (substrings.indexOf(prefixCode) === -1) {
        return res.status(400).send({ error: 'Invalid mobile network code(MNC), please check it and try again.' });
    }

    next();
};

module.exports = {
    CheckEnteredNumber
}