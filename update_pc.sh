git pull

DIR=/var/www/years/2024/02

I1=$DIR/internal/asian_all_other_countries
I2=$DIR/internal/latin_america_europe
I3=$DIR/internal/open_vet
E1=$DIR/external/ApplyVET
E2=$DIR/external/nQkuQcXaNC0ymC1gsCA9
E3=$DIR/external/yqofYnOlpNYqofYn

NODE_ENV=production REACT_APP_PC=internal_asian_vet npm run build
rm -rf $I1
mv build $I1
NODE_ENV=production REACT_APP_PC=internal_latin_america_europe_vet npm run build
rm -rf $I2
mv build $I2
NODE_ENV=production REACT_APP_PC=internal_online_vet npm run build
rm -rf $I3
mv build $I3
NODE_ENV=production REACT_APP_PC=internal_latin_america_europe_elicos npm run build
rm -rf $E3
mv build $E3

NODE_ENV=production REACT_APP_PC=external_asian_vet npm run build
rm -rf $E1
mv build $E1
NODE_ENV=production REACT_APP_PC=external_latin_america_europe_vet npm run build
rm -rf $E2
mv build $E2
NODE_ENV=production REACT_APP_PC=external_online_vet npm run build
rm -rf $E3
mv build $E3
NODE_ENV=production REACT_APP_PC=external_latin_america_europe_elicos npm run build
rm -rf $E3
mv build $E3