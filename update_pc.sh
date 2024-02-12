git pull

DIR=/var/www/years/2024/02

I1=$DIR/internal/asian_all_other_countries
I2=$DIR/internal/latin_america_europe
I3=$DIR/internal/open_vet
E1=$DIR/external/ApplyVET
E2=$DIR/external/nQkuQcXaNC0ymC1gsCA9
E3=$DIR/external/yqofYnOlpNYqofYn

rm -rf $I1
rm -rf $I2
rm -rf $I3
rm -rf $E1
rm -rf $E2
rm -rf $E3

REACT_APP_PC=i1 npm run build
mv build $I1
REACT_APP_PC=i2 npm run build
mv build $I2
REACT_APP_PC=i3 npm run build
mv build $I3

REACT_APP_PC=e1 npm run build
mv build $E1
REACT_APP_PC=e2 npm run build
mv build $E2
REACT_APP_PC=e3 npm run build
mv build $E3