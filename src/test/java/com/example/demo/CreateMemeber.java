package com.example.demo;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.context.annotation.ComponentScan;



import  com.example.demo.entity.ManageUser;
import  com.example.demo.repository.ManageUserRepository;

@SpringBootTest
//@ComponentScan(basePackages = {"repository", "entity","service"})
public class CreateMemeber {
	
	@Autowired
	ManageUserRepository manageUserRepository;
	
	@Test
	public void test() {
		
		 	ManageUser c1 = new ManageUser("小朵", "xiaoduo@example.com", "password123");
	        ManageUser c2 = new ManageUser("阿憲", "axian@example.com", "password123");
	        ManageUser c3 = new ManageUser("潘潘", "panpan@example.com", "password123");
	        ManageUser c4 = new ManageUser("千千蟲", "qianqian@example.com", "password123");
	        ManageUser c5 = new ManageUser("蕾蕾", "leilei@example.com", "password123");
	        ManageUser c6 = new ManageUser("烏薩奇薇薇", "wusaqi@example.com", "password123");
		
//		ManageUser c1 = new ManageUser();
//		c1.setUsername("小朵");
//		
//		ManageUser c2 = new ManageUser();
//		c2.setUsername("阿憲");
//		
//		ManageUser c3 = new ManageUser();
//		c3.setUsername("潘潘");
//		
//		ManageUser c4 = new ManageUser();
//		c4.setUsername("千千蟲");
//		
//		ManageUser c5 = new ManageUser();
//		c5.setUsername("蕾蕾");
//		
//		ManageUser c6 = new ManageUser();
//		c6.setUsername("烏薩奇薇薇");
		
		//儲存
		
		manageUserRepository.save(c1);
		manageUserRepository.save(c2);
		manageUserRepository.save(c3);
		manageUserRepository.save(c4);
		manageUserRepository.save(c5);
		manageUserRepository.save(c6);
		
		
		System.out.println("ok");
		
		
		
	}

}
