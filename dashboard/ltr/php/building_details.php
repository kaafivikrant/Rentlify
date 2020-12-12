<?php
 
     include_once "config.php";

     $target_dir = "../images/";
     $name = test_input($_POST['name']);
	 $address = test_input($_POST['address']);
	 $adminId = $_POST['adminId'];
	 $buildId = $_POST['buildId'];
     $target_file = $target_dir . basename($_FILES["file"]["name"]);

	 $img = basename($_FILES["file"]["name"]);
		
		function test_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
		}
		
     move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);

     // Check connection
     if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
     }

		if(strcmp($buildId,"undefined"))
		{
			$sql = $conn->prepare("UPDATE building_master SET name = ? , address = ? , image = ? WHERE id = ?");
			$sql->bind_param("sssi", $name, $address, $img, $buildId);
		}
		else
		{
			$sql = $conn->prepare("INSERT INTO building_master (adminId,name,address,image) VALUES (?,?,?,?)");
			$sql->bind_param("isss",$adminId, $name, $address, $img);
		}
     if ($sql->execute() === TRUE) {
         echo "1";
     } else {
        echo "0";
     }

     $conn->close();

?>