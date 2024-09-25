package  com.example.demo.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import  com.example.demo.entity.ManageUser;

@Repository
public interface ManageUserRepository extends JpaRepository<ManageUser,Long>{
	
	
//通過數據庫查找用戶的詳細信息。
   ManageUser findByUsername(String username);

}

