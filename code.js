function main() {
  
  
  //За какой период смотрим статистику | Define period for stats look-up
  var dateRange = 'LAST_7_DAYS';
  
  //При каком кол-ве показов, проверять кампанию. Значение "текст", если меняете цифру, то только в кавычках как сейчас.
  //Define min number of campaign expressions to look-up. At least 1000 recommended. Change value if you want. Format - string.
  var minImpressions = '1000';
  
  //Список ключевых слов, в случае обнаружения в URL которых, необходимо добавить Placament в исключения аккаунта / кампании.
  //Keyword pattern to find and exclude ads' placements. You can change values. Format - string.
  var wordsToExclude = ['flash','games','kid','kids','xxx','casino','777','game', 'skazki',
                        'skazochki','skazka','sex','love','igr','igry','igra'];
  
  //Тут вся магия. Ничего не трогать 🙂
  //Main code, not recommended to edit.
  var campaignIterator = AdsApp.campaigns().withCondition("Impressions > " + minImpressions).forDateRange(dateRange).get();
  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();    
    
    var displayPlacements = campaign.display().placements().get();    
    while (displayPlacements.hasNext()){
      var placement = displayPlacements.next();      
      for (var i=0; i<=wordsToExclude.length; i++){
        if (placement.getUrl().indexOf(wordsToExclude[i])!==-1){
          
          function exclusion(campaign, placementURL){
            var campaign = campaign;
            var placementURL = placementURL;
            return campaign.display().newPlacementBuilder().withUrl(placementURL).exclude().getErrors();
          }
          
          var errors = exclusion(campaign, placement.getUrl());
          if (errors != ''){
            Logger.log(placement.getUrl() + ' was NOT excluded from campaign: ' + campaign.getName() + '. Errors: ' + errors);
          }
          else{          
            Logger.log(placement.getUrl() + ' excluded from campaign: ' + campaign.getName());
          }
        }
      }
    }
  }
}
