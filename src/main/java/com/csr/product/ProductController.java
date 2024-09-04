package com.csr.product;


import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.user.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
public class ProductController {

    @Autowired
    private ProductDao productDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private ProductStatusDao productStatusDao;

    @Autowired
    private UserDao userDao;


   @GetMapping(value = "/product/findall",produces = "application/json")
    public List<Product> getAllProduct(){
       Authentication auth = SecurityContextHolder.getContext().getAuthentication();
       Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Product");
       if(!loggedUserPrivilege.getSel_privi()){
           return new ArrayList<>();
       }
       return productDao.getAllAsc();
   }

   @GetMapping(value = "/product/status/findall",produces = "application/json")
    public List<ProductStatus> getAllProductStatus(){
       return productStatusDao.findAll();
   }

   @GetMapping(value = "/product/bymaterial/{matId}",produces = "application/json")
    public List<Product> getAllByMaterialNo(@PathVariable Integer matId){
       return productDao.getProductListByMaterial(matId);
   }


    @GetMapping(value = "/product")
    public ModelAndView privilegeUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Product");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView privilegeModelAndViewError = new ModelAndView();
            privilegeModelAndViewError.setViewName("error.html");
            return privilegeModelAndViewError;
        }else {
            ModelAndView materailModelAndView = new ModelAndView();
            materailModelAndView.addObject("title", "Product Management");
            materailModelAndView.addObject("navbartitle", "PRODUCT MANAGEMENT MODULE");
            materailModelAndView.addObject("loggeduser", auth.getName());
            materailModelAndView.setViewName("product.html");
            return materailModelAndView;
        }
    }

    @PostMapping(value = "/product")
    public String postMappingProduct(@RequestBody Product product){
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Product");
        if (!loggedUserPrivilege.getIns_privi()) {
            return "Save did not completed : You dont have the privilege";
        }

        //finding already exist by name
        Product productByName = productDao.findByName(product.getName());
        if(productByName!=null){
            return "Product name is already exist..!";
        }
        //checking does 'product' has Material
        if(product.getProductHasMaterialList()==null){
            return "Product must have material.";
        }

        if(product.getProduct_status_id().getId()==null){
            return "Product must have status";
        }



        try{
            String nextProductNo = productDao.getNextProductNo();
            if((nextProductNo==null)||(nextProductNo.equals(""))){
                product.setProductno("P00001");
            }else {
                product.setProductno(nextProductNo);
            }
            product.setAdded_time(LocalDateTime.now());
            product.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());

            for(ProductHasMaterial phm : product.getProductHasMaterialList()){
                phm.setProduct_id(product);
            }

            productDao.save(product);

            return "OK";

        }catch (Exception e){
            return "Save not Completed : " + e.getMessage();
        }
    }

    @PutMapping(value = "/product")
    public String putMappingProduct(@RequestBody Product product){
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Product");
        if (!loggedUserPrivilege.getUpd_privi()) {
            return "Save did not completed : You dont have the privilege";
        }
        //Checking for already existing by ID
        Product extProduct = productDao.getReferenceById(product.getId());
        if(extProduct==null){
            return "Product do not exist..!";
        }
        //finding already exist by name
        Product productByName = productDao.findByName(product.getName());
        if(!Objects.equals(productByName, extProduct)){
            return "Product name is already exist..!";
        }
        //checking does 'product' has Material
        if(product.getProductHasMaterialList()==null){
            return "Product must have material.";
        }

        if(product.getProduct_status_id().getId()==null){
            return "Product must have status";
        }

        try{

            if(product.getProduct_status_id().equals(productStatusDao.getReferenceById(3))){
                product.setDeleted_time(LocalDateTime.now());
                product.setDeleted_user_id(userDao.findByUsername(auth.getName()).getId());
            }

            product.setUpdated_time(LocalDateTime.now());
            product.setUpdated_user_id(userDao.findByUsername(auth.getName()).getId());

            for(ProductHasMaterial phm : product.getProductHasMaterialList()){
                phm.setProduct_id(product);
            }

            productDao.save(product);

            return "OK";

        }catch (Exception e){
            return "Save not Completed : " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/product")
    public String deleteMappingProduct(@RequestBody Product product){

        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Product");
        if (!loggedUserPrivilege.getDel_privi()) {
            return "Save did not completed : You dont have the privilege";
        }

        //Checking for already existing by ID
        Product extProduct = productDao.getReferenceById(product.getId());
        if(extProduct==null){
            return "Product do not exist..!";
        }

        ProductStatus productStatusDel = productStatusDao.getReferenceById(3);

        if(product.getProduct_status_id().equals(productStatusDel)){
            return "Product already deleted..!";
        }
        List<Product> productsList = productDao.getProductsInProduction();
        Boolean productInProduction = false;
        for(Product product1: productsList){
            if(product1.getId().equals(product.getId())){
                productInProduction = true;
                break;
            }
        }

        if(productInProduction){
            return "This Product do have unfinished order currently processing..!";
        }

       try {

           product.setProduct_status_id(productStatusDel);
           product.setDeleted_time(LocalDateTime.now());
           product.setDeleted_user_id(userDao.findByUsername(auth.getName()).getId());

           for(ProductHasMaterial phm : product.getProductHasMaterialList()){
               phm.setProduct_id(product);
           }

           productDao.save(product);

           return "OK";

       }catch (Exception e){
           return "Save not Completed : " + e.getMessage();
       }
    }

}
