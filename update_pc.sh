git pull

DIR=/var/www/years/2024/02

I1=$DIR/internal/asian-and-all-other-countries-vet
I2=$DIR/internal/latin-america-and-europe-vet
I3=$DIR/internal/open-vet
I4=$DIR/internal/latin-america-and-europe-elicos

E1=$DIR/external/ApplyVET
E2=$DIR/external/latin-america-and-europe-vet-onshore
E3=$DIR/external/yqofYnOlpNYqofYn
E4=$DIR/external/latin-america-and-europe-elicos-onshore

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
rm -rf $I4
mv build $I4

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
rm -rf $E4
mv build $E4