
const main_Category = require('../DataBase/mainCategory')


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