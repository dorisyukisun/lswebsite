package com.example.demo.security;



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	
	 
    //配置身份驗證      
    @Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		// TODO Auto-generated method stub
		super.configure(auth);
	}

    //配置web安全性
	@Override
	public void configure(WebSecurity web) throws Exception {
		
		super.configure(web);
	}

	//配置http安全
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.formLogin()
			.loginProcessingUrl("/login")
			.loginPage("/admin/manage-users/login")
			.successForwardUrl("/admin/manage-users/login")
			.failureForwardUrl("/fail");
		
		http.authorizeHttpRequests()
		// all visitors can access without authorization
		.antMatchers("/admin/mange-users/login").permitAll()
		// all visitors must be authenticated before access
		.anyRequest().authenticated();		
		
		http.rememberMe()
			.tokenValiditySeconds(30)
			.key("mykey");
		 
	}

	// 提供 PasswordEncoder Bean，用於加密密碼
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    
    
}