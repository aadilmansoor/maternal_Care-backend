
const main_Category = require('../DataBase/mainCategory')

const emergency = require('../DataBase/emergency')
// add main category

exports.add_main_category = async(req,res)=>{

    const {mainCategory}=req.body
            try {
        const category = await main_Category.findOne({mainCategory})
        if (category){
           res.status(400).json({message:"category already exists"})
        }
        else{
          const  newcategory = new  main_Category({mainCategory})
          await newcategory.save()
          res.status(200).json({message:"category added successfully"})
        }
    } catch (error) {
        res.status(500).json({error, message:"server error"})
    }


}

// get all category
exports.getallcategories = async (req, res) => {
    try {
      const newUser = await main_Category.find();
  
      res.status(200).json({ newUser });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  };


  //delete category
exports.deleteCategory = async(req,res)=>{
    const {mainCategory_id}=req.body
            try {
        const category = await main_Category.findOne({_id:mainCategory_id})
        if (category){
          
           const deletecategory = await main_Category.deleteOne({_id:mainCategory_id})
           console.log(deletecategory);
           res.status(200).json({message:"category deleted successfully"})

        }
        else{
            res.status(400).json({message:"delete failed"})
        }
    } catch (error) {
        res.status(500).json({error, message:"server error"})
    }
}

//subcategory add

exports.addSubcategory= async (req,res)=>{
    const {mainCategory,sub_category}=req.body
console.log(mainCategory,sub_category);
    try {
        const existCategory = await main_Category.findOne({mainCategory})

if(existCategory){

    existCategory.subCategory.push({subcategory: sub_category})
    await existCategory.save(); 
    res.status(200).json({mainCategory,message: " subcategory added successfully"})
}

else{
    res.status(400).json({message:"main category not found. please add main category"})

}
        
    } catch (error) {
        res.status(500).json({error, message:"server error"})
 
    }
}

// get sub category

exports.get_sub_category = async(req,res)=>{

    const {mainCategory}=req.body
            try {
        const category = await main_Category.findOne({mainCategory})
        if (category){
           res.status(200).json({category,message:"fetched successfully"})
        }
        else{
         
          res.status(400).json({message:"fectched error"})
        }
    } catch (error) {
        res.status(500).json({error, message:"server error"})
    }


}


// add emergency
exports.add_emergency = async(req,res)=>{

    const {
        emergency_support,
        location,
        phonenumber}=req.body
            try {
        const exist_emergency = await emergency.findOne({ emergency_support,
            location,
            phonenumber})
        if (exist_emergency){
           res.status(400).json({message:"details already exists"})
        }
        else{
          const  new_emergency = new  emergency({  emergency_support,
            location,
            phonenumber})
          await new_emergency.save()
          res.status(200).json({new_emergency,message:"emergency added successfully"})
        }
    } catch (error) {
        res.status(500).json({error, message:"server error"})
    }
}

// get all emergency details
exports.getEmergency = async(req,res)=>{
   try {
    const emergency_details= await emergency.find()
    if(emergency_details.length>0){
        res.status(200).json({emergency_details,message:"fetched successfully"})

    }
    else{
        res.status(400).json({message:"no data available"})
    }
   } catch (error) {
    res.status(500).json({error, message:"server error"})

   }
}
