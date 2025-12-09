const moment = require('moment')
{/* <link rel="stylesheet" href="https://ims-systems-web-frontend.s3.eu-west-2.amazonaws.com/app.min.css" > */}
module.exports = data => `

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    
    <title>Document</title>
</head>

<body class="white-content">
    <div class="">
        <div class="card-invoice card">
            <div class="card-header">Invoice#3002</div>
            <div class="card-body">
                <div class="row">
                    <div class="col-7">
                        <div class="card">
                            <div class="d-flex card-body">
                                <img class="invoice-logo mr-3"
                                    src="https://addvantage-technologies.co.uk/images/logo.svg" alt="...">
                                <div>
                                    <h4>Company information</h4>
                                    <h5>Addvantage technologies</h5>
                                    <p>Information Technology and Services Greater Manchester, Bolton<br>
                                        <span class="text-muted">hello@imssystems.tech</span>
                                    </p>
                                    <p>
                                        Bank account <span class="text-muted">123987192947981723</span>
                                    </p>
                                    <p>
                                        Sort code <span class="text-muted">126311</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-5">
                        <div class="card">
                            <div class="card-body">
                                <div>
                                    <h4>Customer information</h4>
                                    <h5>AWS</h5>
                                    <p>109/c barontek dhaka cantonment dhaka 1206.<br><span
                                            class="text-muted">riadhossain7464@gmail.com</span></p>
                                    <p>Due <span class="text-muted">22/02/2022</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <table class="table">
                    <thead class="text-primary">
                        <tr>
                            <th class="header">Items</th>
                            <th class="header">Price</th>
                            <th class="header">Quantity</th>
                            <th class="header">VAT%</th>
                            <th class="header">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="">
                            <td class="">Asus zenbook</td>
                            <td class="">1000</td>
                            <td class="">1</td>
                            <td class="">15</td>
                            <td class="">1150</td>
                        </tr>
                        <tr>
                            <td colspan="3"></td>
                            <td class="text-info text-right">Discount %</td>
                            <td class=""> 10 </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3"></td>
                            <td class="text-success text-right">Total amount Inc. VAT</td>
                            <td class="text-light">1035</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="card-footer">
                <ul class="nav">
                    <li class="nav-item"><a class="nav-link text-light" href="https://addvantage-technologies.co.uk/"
                            target="_blank">Addvantage Technologies</a></li>
                    <li class="nav-item"><a class="nav-link" target="_blank"
                            href="https://addvantage-technologies.co.uk/"><img alt="imssystems"
                                class="invoice-footer-logo"
                                src="https://addvantage-technologies.co.uk/images/logo.svg"></a></li>
                </ul>
            </div>
        </div>
    </div>
</body>

</html>

`