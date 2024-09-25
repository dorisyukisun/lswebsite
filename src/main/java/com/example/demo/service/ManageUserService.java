package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entity.ManageUser;
import com.example.demo.repository.ManageUserRepository;

@Service
public class ManageUserService {
	
	@Autowired
    private ManageUserRepository  manageUserRepository; // 正確地注入 ManageUserRepository

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 保存用戶並加密密碼
    public ManageUser saveUser(ManageUser manageUser) {


    // 加密密碼
    
        String encryptedPassword = passwordEncoder.encode(manageUser.getPassword());
        manageUser.setPassword(encryptedPassword);
        return  manageUserRepository.save(manageUser); // 保存並返回用戶
        
    }

    // 獲取所有用戶（從數據庫）
    public List<ManageUser> getAllUsers() {
        return  manageUserRepository.findAll(); // 直接從數據庫查詢所有用戶
    }
 

    // 修改用戶（透過 ID）
    public ManageUser updateUser(Long id, ManageUser manageUser) {
        Optional<ManageUser> existingUser =  manageUserRepository.findById(id);
        if (existingUser.isPresent()) {
            ManageUser userToUpdate = existingUser.get();
            userToUpdate.setUsername(manageUser.getUsername());
            userToUpdate.setPassword(passwordEncoder.encode(manageUser.getPassword()));
            return  manageUserRepository.save(userToUpdate); // 保存更新後的用戶
        } else {
            throw new RuntimeException("User not found with ID: " + id); // 可替換為更合適的自訂例外
        }
    }

    // 刪除用戶（透過 ID）
    public void deleteUser(Long id) {
    	 manageUserRepository.deleteById(id); // 使用 Spring Data JPA 刪除用戶
    }

    
    //負責使用 UserRepository 從數據庫中查找用戶信息並進行比對，返回認證結果。
	public boolean authenticate(String username, String password) {
		  ManageUser user = manageUserRepository.findByUsername(username);
	        if (user != null && passwordEncoder.matches(password,user.getPassword())) {
	            return true;
	        }
		return false;
	}

}
