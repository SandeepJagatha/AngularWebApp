(function () {
    'use strict';

    angular.module('demoApp')
      .controller('AccountController', AccountController)
      .controller('DepositController', DepositController)
      .controller('WithdrawController', WithdrawController);

      AccountController.$inject = ['$scope'];
        function AccountController($scope) {
           var aController = this;
           aController.accountBalance = 0;
           aController.activate = _activate;

           function _activate()
           {
              $scope.$on("AmountDeposited", _amountDepositedHandler);
              $scope.$on("AmountWithdrawn", _amountWithdrawnHandler);
           }

           function _amountDepositedHandler(event, args)
           {
              aController.accountBalance += eval(args.amount);
           }

           function _amountWithdrawnHandler(event, args)
           {
              if(aController.accountBalance - eval(args.amount) < 0)
              {
                 $scope.$broadcast("WithdrawalNotAllowed", { balance: aController.accountBalance });
              }
              else
              {
                 aController.accountBalance -= eval(args.amount);
              }
           }

           _activate();

        }

        DepositController.$inject = ['$scope'];
        function DepositController($scope) {
           var dController = this;
           dController.amount = 0;
           dController.deposit = _deposit;

           function _deposit()
           {
              $scope.$emit("AmountDeposited", {amount: dController.amount});
              dController.amount = 0;
           }
        }

        WithdrawController.$inject = ['$scope'];
        function WithdrawController($scope) {
           var wController = this;
           wController.amount = 0;
           wController.validationError = "";
           wController.activate = _activate;
           wController.withdraw = _withdraw;

           function _activate()
           {
              $scope.$on("WithdrawalNotAllowed", _withdrawalNotAllowedHandler);
           }

           function _withdraw()
           {
              wController.validationError = "";
              $scope.$emit("AmountWithdrawn", {amount: wController.amount});
              wController.amount = 0;
          }
          function _withdrawalNotAllowedHandler(event, args)
          {
             wController.validationError = "You cannot withdraw more than $" + args.balance;
          }
         _activate();
     }

})();
