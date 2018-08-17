<?php

/**
 * Скрипт для відправки телефону через e-mail,
 * автоматично перевіряє номер телефону на відсутність зайвої інформації та правильність вводу.
 * Сприймає всі міжнародні формати:
                (123)456-7890 | (123)456-7890 x123 | +1 (123)456-7890
                12 3456 789 0 x1234 | (123)456-7890x123 |(123)456-7890ext123
                (123)456-7890 extension123 | 123.456.7890 | 1234567890 | 1234567
                12 34 56 78 90 | 12 3 4567 890123 x4567 | +12 3456 7890 | +12 34 56 7890
                +12 3456 7890 | +12 34567890
 *
 *  Юрій Володимирович <yurii.radio@gmail.com>
 */

if($_SERVER['REQUEST_METHOD'] == 'POST') {
	
	// змінна для імені абонента
    $abonent_name = strip_tags(substr(trim($_POST['abonent_name']), 0, 30));

    // змінна для номеру телефону
    $phone_number = strip_tags(substr(trim($_POST['phone_number']), 0, 19));
	
    // змінна для відповіді, формат json
    $response = array();

    //International & Domestic Phone Numbers with Ext
    if (!preg_match('/^([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9A-Z \.\-]{1,32})((x|ext|extension)?[0-9]{1,4}?)$/', $phone_number)) {
    //if (false) {
        $response['error'] = "Необхібно ввести коректний номер телефону!\n". $phone_number;
        echo json_encode($response);
        exit();
    }

    // Добавляємо дату та час до нашого пповідомлення
    $date_time = date('d.m.y, H:i');
    // Заголовок e-mail повіломлення
    $subject = "Новий зворотний дзвінок";
    // $to - кому відправляємо e-mail
    $to = "you_mail@mail.net";
    // $from - від кого відправляємо e-mail
    $from = "http://site.net.ua <admin@site.net.ua>";
    // IP адреса відправника
    $remote_addr=$_SERVER["REMOTE_ADDR"];

    // створюємо наше повідомлення
    $message = "<b>" . $subject . ":</b>\t" . $date_time . "<br />"
			. "<b>Ім’я абонента:</b>\t" . $abonent_name . "<br />"
            . "<b>Контактний телефон:</b>\t" . $phone_number . "<br />"
            . "<b>IP відправника:</b>\t" . $remote_addr;

    $headers  = "Content-type: text/html; charset=utf-8 \r\n";
    $headers .= "From: " . $from . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    $result = false;
    $result = mail($to, $subject.":\t".$date_time, $message, $headers);

    if($result) {
        $response['success'] = "Повідомлення надіслано!!!";
    } else {
        $response['success'] = '<font color="#FF0000">Повідомлення не надіслано!!! Спробуйте пізніше...</font>';
    }
    echo json_encode($response);
    exit();
}

exit();
