const verifyInput= (...params) => {
    let value = params[0];
    switch (typeof value){
        case 'undefined' || null :
            throw `Property missing: ${name}`
        case  'object' || 'boolean':
            return value;
        case 'number':
            let zeroIntegerAllowed = params[2];
            if(zeroIntegerAllowed == ZERO_INT_ALLOWED){
                return value;
            }else{
                if(value>0){
                    return value;
                }else{
                    throw `Property: ${name} shoukd be greater than zero`
                }
            }
        default:
            let forceFormat = params[1] ? params[1] : '';
            let zeroIntegerAllowed = params[2] ? params[2] : "";
            let forceInt = params[3] ? params[3] : false;
            if(forceInt){
                throw `Property:${name} should be a number`
            }else{
                if(forceFormat == CHECK_INT_FORMAT){
                    if (parseInt((value).toString().replace(' ', '')) >= 0){
                        if(zeroIntegerAllowed == ZERO_INT_ALLOWED){
                            return parseInt((value).toString().replace(' ', ''));
                        }else{
                            if((parseInt((value).toString().replace(' ', '')) >0)){
                                return parseInt((value).toString().replace(' ', ''));
                            }else{
                                throw `Property should be greater than 0: ${name}`
                            }   
                        }
                    }else{
                        throw `Property should be int: ${name}`
                    } 
                }else if(forceFormat == CHECK_TIME_FORMAT){
                    if(moment(value, "HH:mm:ss").isValid()){
                        return value;
                    }else{
                        throw `${name}: time is not in correct format`
                    }                   
                }else if(forceFormat == CHECK_DATE_FORMAT){
                    if(moment(value, "YYYY-MM-DD").isValid()){
                        return value;
                    }else{
                        throw `${name}: date is not in correct format`
                    }
                }else{
                    let insertableText = value.trim();
                    return insertableText;
                }
            }

    }
}

module.exports = {
    verifyInput
}