<?php

	include "config.php";

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	
	$ref = $request->ref;
	$mobile = $request->number;
	
	if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
     }
	

	if($ref==1)
	{
	$name = $request->name;
		
	$otp=rand(100000,999999);
	
	$sql2 = "SELECT * FROM admin_master WHERE contact='$mobile'";
	
	$result2 = $conn->query($sql2);
	
	$rowno = mysqli_num_rows($result2);
	
	if($rowno)
	{
		$sql1 = "UPDATE admin_master SET otp='$otp', name='$name' WHERE contact='$mobile'";
	
		$result1 = $conn->query($sql1);
		
		if($result1)
		{
			$dataNik = 1;
		}
		else
		{
			$dataNik = 0;
		}
	}
	else
	{	
		$sql1 = "INSERT INTO admin_master (name,contact,otp) VALUES('$name','$mobile','$otp')";
	
		$result1 = $conn->query($sql1);
		
		if($result1)
		{
			$dataNik = 1;
		}
		else
		{
			$dataNik = 0;
		}
	}
	
	if($result1)
	{
	
		$messageNik = "Your OTP for AVNN Technologies:".$otp;
	
		// Account details
		$apiKey = urlencode('eWnIwu4ZWwI-DYUd7LVkC6iM72zogM3jV7DSELeWPM');
		
		// Message details
		$numbers = array(918788299853);
		$sender = urlencode('TXTLCL');
		$message = rawurlencode($messageNik);
	 
		$numbers = implode(',', $numbers);
	 
		// Prepare data for POST request
		$data = array('apikey' => $apiKey, 'numbers' => $numbers, "sender" => $sender, "message" => $message);
	 
		// Send the POST request with cURL
		
		//$ch = curl_init('https://api.textlocal.in/send/');
		//curl_setopt($ch, CURLOPT_POST, true);
		//curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
		//curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		//$response = curl_exec($ch);
		//curl_close($ch);
	
		// Process your response here
		echo $dataNik;
	}
	}
	
	else if($ref==2)
	{
		$otp = $request->otp;
		
		$sql2 = "SELECT * FROM admin_master WHERE contact='$mobile'";
	
		$result2 = $conn->query($sql2);
		
		$data = null;
		
		while($row2 = $result2->fetch_assoc())
		{
			$data = $row2;
			$dbotp = $row2['otp'];
		}
		
		if($dbotp == $otp)
		{
			$data['flag'] = 1;
		}
		else
		{	
			$data['flag'] = 0;
		}
		
		echo json_encode($data);
		
	}
	
	else if($ref==3)
	{
	$otp=rand(100000,999999);
	
	$sql2 = "SELECT * FROM members WHERE contact='$mobile'";
	
	$result2 = $conn->query($sql2);
	
	$rowno = mysqli_num_rows($result2);
	
	if($rowno)
	{
		$dataNik = 1;
		
		$sql1 = "UPDATE members SET otp='$otp' WHERE contact='$mobile'";
	
		$result1 = $conn->query($sql1);
		
		if($result1)
		{
			$dataNik = 1;
			
			$messageNik = "Your OTP for AVNN Technologies:".$otp;
	
			// Account details
			$apiKey = urlencode('eWnIwu4ZWwI-DYUd7LVkC6iM72zogM3jV7DSELeWPM');
			
			// Message details
			$numbers = array(918788299853);
			$sender = urlencode('TXTLCL');
			$message = rawurlencode($messageNik);
		 
			$numbers = implode(',', $numbers);
		 
			// Prepare data for POST request
			$data = array('apikey' => $apiKey, 'numbers' => $numbers, "sender" => $sender, "message" => $message);
		 
			// Send the POST request with cURL
			
			//$ch = curl_init('https://api.textlocal.in/send/');
			//curl_setopt($ch, CURLOPT_POST, true);
			//curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
			//curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			//$response = curl_exec($ch);
			//curl_close($ch);
		
			// Process your response here
			
		}
		else
		{
			$dataNik = 0;
		}
	}
	else
	{
		$dataNik = 2;
	}
	
	echo $dataNik;
	
	}
	
	else if($ref==4)
	{
		$otp = $request->otp;
		
		$sql2 = "SELECT * FROM members WHERE contact='$mobile'";
	
		$result2 = $conn->query($sql2);
		
		$data = null;
		
		while($row2 = $result2->fetch_assoc())
		{
			$data = $row2;
			$dbotp = $row2['otp'];
		}
		
		if($dbotp == $otp)
		{
			$data['flag'] = 1;
		}
		else
		{	
			$data['flag'] = 0;
		}
		
		echo json_encode($data);
		//echo 123;
	}
	
?>