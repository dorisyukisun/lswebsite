package com.example.demo.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity  //標識這個類是一個 JPA 實體
@Table(name = "manageuser") //指定與實體關聯的資料庫表的名稱
public class ManageUser {

    @Column(nullable = false, unique = true)
    private String username; // 登入者

    @Id // 定義主鍵
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 由資料庫中自動產出的序號
    private Long id;

    @Column
    private String email;

    @Column 
    private String password;

    public ManageUser() {
        // 無參數建構子
    }

    public ManageUser(String username, String email, String password) { //建構子：已移除 id 參數，因為 id 應由資料庫自動生成。
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Getter 和 Setter 方法 //id 的 getter：雖然 id 是自動生成的，但你可能會需要從實體中獲取它的值，所以保留了 getId() 方法。
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
