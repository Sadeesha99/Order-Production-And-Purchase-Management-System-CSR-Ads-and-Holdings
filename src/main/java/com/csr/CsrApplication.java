package com.csr;

import com.csr.customer.CustomerController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;


import java.time.LocalDateTime;

@SpringBootApplication
@RestController  //Letting know dispatcher severlet about mapping of this file
public class CsrApplication {

	public static void main(String[] args) {
		SpringApplication.run(CsrApplication.class, args);
		System.out.println("Project Running");
		System.out.println(LocalDateTime.now());
	}


}
