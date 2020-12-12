<?php
 
     include_once "config.php";

     $target_dir = "../images/";
     $name = test_input($_POST['name']);
	 $b_selected = $_POST['b_selected'];
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
		
		$sql = $conn->prepare("INSERT INTO building_docs (bId, docPath, docType) VALUES (?,?,?)");
		$sql->bind_param("iss",$b_selected, $img, $name);
		
		if($sql->execute())
		{
			$data = 1;
		}
		else
		{
			$data = 0;
		}
		
		echo $data;

     $conn->close();

?>