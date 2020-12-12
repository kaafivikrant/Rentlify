<?php

	include "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	
	$ref = $request->ref;
	
	
	if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
     }
	

	if($ref==1)
	{
	
		$message = $request->message;
		$name = $request->name;
		$mobile = $request->mobile;
		$email = $request->email;
			
		$sql = $conn->prepare("INSERT INTO contact(name, email, mobile, message) VALUES(?,?,?,?)");
		$sql->bind_param("ssis",$name,$email,$mobile,$message);
	
		if($sql->execute() === TRUE) {
         echo "1";

		 } else {
			echo "0";
		 }
	
	}
	
?>