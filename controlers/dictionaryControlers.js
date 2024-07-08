const MongoCli = require('../mongo_client')


const getTranslation = async (req,res) =>{
    
    const { word } = req.params
    
        var projection = {
            MelingoId : 1,
            Entry : 1,
            TranslationFull: 1
        }
        
           const translation = await MongoCli.db.collection('entriesnodu').find({Entry: word}).project(projection).toArray()
           
           if(translation.length === 0 ) {
            
            res.status(500).json({message: "No translation for this word!"})

        } else{
            const usage  = await MongoCli.db.collection('examples').find({MelingoID: translation[0].MelingoId}).project({MelingoID: 1, Text: 1}).toArray()
            if(usage.length === 0 ){res.json({
                Entry: translation[0].Entry,
                TranslationFull: translation[0].TranslationFull,
                MelingoId: translation[0].MelingoId,
                Text: `No available usage for ${word} `
                })
            }
            else {
                    const response = {
                        Entry: translation[0].Entry,
                        TranslationFull: translation[0].TranslationFull,
                        MelingoId: translation[0].MelingoId,
                        Text: usage[0].Text
                   }
                   res.status(200).json(response)
                }
            
            
            
            
        }
} 

const addTranslation = async(req,res) =>{
    
    try{
        var newTranslation = {
            MelangoId: req.body.MelangoId,
            Entry: req.body.Entry,
            TransaltionFull: req.body.TranslationFull,
        } 

        var newUsage = {
            MelangoId: req.body.MelangoId,
            Text: req.body.Text
        }

        await MongoCli.db.collection('test').insertOne(newTranslation)
        await MongoCli.db.collection('test1').insertOne(newUsage)
        res.status(200).json(newTranslation)


    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const updateTranslation = async(req,res) =>{
    
    var {word} = req.params
    
    var newProperties = {
        TransaltionFull: req.body.TransaltionFull,
        Text: req.body.Text
    }
    var melingoId = await MongoCli.db.collection('test').find({Entry: word}).project({MelingoId: 1}).toArray()
        if(melingoId.length === 0){
            res.status(500).json({message: `The ${word} is not present in the dictionary`})
            return
        }else{
            if (newProperties.TransaltionFull === '') {
                await MongoCli.db.collection('test1').updateOne({MelingoId: melingoId[0].MelingoId}, {$set:{Text: newProperties.Text}})
            }
            else if(newProperties.Text === '' )await MongoCli.db.collection('test').updateOne({MelingoId: melingoId[0].MelingoId}, {$set:{TransaltionFull: newProperties.TransaltionFull}})
            else {
                await MongoCli.db.collection('test').updateOne({MelingoId: melingoId[0].MelingoId}, {$set:{TransaltionFull: newProperties.TransaltionFull}})
                await MongoCli.db.collection('test1').updateOne({MelingoId: melingoId[0].MelingoId}, {$set:{Text: newProperties.Text}})
        }
        res.status(200).json({message:"The changes have been made successfully!"})
            
    }
    //res.status(200).json({message: `You have successfully updated ${word}` })
}


const deleteTransaltion = async(req,res)=>{

    var {word} = req.params
    try{
    var deletedContent = await MongoCli.db.collection('test').findOneAndDelete({Entry: word})
    await MongoCli.db.collection('test1').findOneAndDelete({MelingoId: deletedContent.MelingoId})
    res.status(200).json({message: "The word have been succsefully deleted"})
}catch(err){
    res.status(500).json({message: `The word: ${word} is not in the dictionary`})
}


}


    module.exports = {
        getTranslation,
        addTranslation,
        updateTranslation,
        deleteTransaltion
    }