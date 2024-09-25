package  com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model; // 修正這裡的Model導入
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import  com.example.demo.entity.ManageUser;
import  com.example.demo.service.ManageUserService;

@Controller
@RequestMapping("admin/manage-users") // 設定基礎路徑
public class ManageUserController {
    
    @Autowired
    private ManageUserService manageUserService;

    // 查詢所有用戶
    @GetMapping
    public String getAllUsers(Model model) {
        List<ManageUser> users = manageUserService.getAllUsers();
        model.addAttribute("users", users); // 使用 Model 來傳遞數據到頁面
        return "manage-users"; // 返回 Thymeleaf 模板頁面
    }
     
    //處理從 login.html 提交的表單，接收用戶名和密碼，並調用 AuthService 來進行驗證。
    @PostMapping("/login") 
        public String login(@RequestParam String username, @RequestParam String password, Model model) {
            if (manageUserService.authenticate(username, password)) {
                return "redirect:admin/manager-users";
            } else {
                model.addAttribute("error", "Invalid username or password");
                return "login";
            }
        }

    @PostMapping("/add")
    public String addUser(@ModelAttribute ManageUser user) {
        manageUserService.saveUser(user); // 保存用戶數據
        return "redirect:admin/manage-users"; // 添加完成後重定向回用戶管理頁面
    }

    @PostMapping("/edit/{id}")
    public String editUser(@PathVariable Long id, @ModelAttribute ManageUser user) {
        manageUserService.updateUser(id, user); // 編輯用戶數據
        return "redirect:admin/manage-users"; // 編輯完成後重定向回用戶管理頁面
    }
    

    @PostMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        manageUserService.deleteUser(id); // 刪除用戶
        return "redirect:admin/manage-users"; // 刪除完成後重定向回用戶管理頁面
    }
}

