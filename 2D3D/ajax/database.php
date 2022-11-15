<?php include ('config/db.php')?>
<?php
//header("Content-Type: application/json; charset=utf-8");
$sql ="";
try {
    $remote_addr = $_SERVER["REMOTE_ADDR"];
    $forwarded =  $_SERVER["HTTP_X_FORWARDED_FOR"];

    if (!empty($_POST["action"]) && 
        $_POST["action"] == "update-account") {

        $value = htmlspecialchars($_POST["value"]);
        $sql = "UPDATE 
            param 
        SET 
            value='".$value."',
            ip_address='".$remote_addr."',
            forwarded='".$forwarded."' 
        WHERE id=2";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        echo $sql;
    }
    else if (!empty($_POST["action"]) && 
        $_POST["action"] == "get-account") {

        $sql = "SELECT value FROM param WHERE id=2";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $rowCount = $stmt->rowCount();
        $details = $stmt->fetchAll(); 

        //echo $sql;
        echo json_encode($details);
    }
    else if (!empty($_POST["action"]) && 
        $_POST["action"] == "get-config") {

        $sql = "SELECT value FROM param WHERE id=1";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $rowCount = $stmt->rowCount();
        $details = $stmt->fetchAll(); 

        //echo $sql;
        echo json_encode($details);
    }
}
catch (PDOException $e) {
   echo 'Connection failed: ' . $e->getMessage();
   echo $sql;
}
catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
    echo $sql;
}
?>
