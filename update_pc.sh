git pull

DIR=/var/www/years/2024/02

I1=$DIR/internal/asian-and-all-other-countries-vet
I2=$DIR/internal/latin-america-and-europe-vet
I4=$DIR/internal/latin-america-and-europe-elicos
I5=$DIR/internal/asian-and-all-other-countries-als-college
I6=$DIR/internal/latin-america-and-europe-aged-care
I7=$DIR/internal/latin-america-and-europe-adccd

E1=$DIR/external/ApplyVET
E2=$DIR/external/latin-america-and-europe-vet-onshore
E4=$DIR/external/latin-america-and-europe-elicos-onshore
E5=$DIR/external/als-college
E6=$DIR/external/latin-america-europe-aged-care
E7=$DIR/external/latin-america-and-europe-adccd


NODE_ENV=production REACT_APP_PC=internal_asian_vet npm run build
rm -rf $I1
mv build $I1
NODE_ENV=production REACT_APP_PC=internal_latin_america_europe_vet npm run build
rm -rf $I2
mv build $I2
NODE_ENV=production REACT_APP_PC=internal_latin_america_europe_elicos npm run build
rm -rf $I4
mv build $I4
NODE_ENV=production REACT_APP_PC=internal_asian_all_other_countries_als_college npm run build
rm -rf $I5
mv build $I5
NODE_ENV=production REACT_APP_PC=internal_latin_america_europe_aged_care npm run build
rm -rf $I6
mv build $I6
NODE_ENV=production REACT_APP_PC=internal_latin_america_europe_adccd npm run build
rm -rf $I7
mv build $I7

NODE_ENV=production REACT_APP_PC=external_asian_vet npm run build
rm -rf $E1
mv build $E1
NODE_ENV=production REACT_APP_PC=external_latin_america_europe_vet npm run build
rm -rf $E2
mv build $E2
NODE_ENV=production REACT_APP_PC=external_latin_america_europe_elicos npm run build
rm -rf $E4
mv build $E4
NODE_ENV=production REACT_APP_PC=external_asian_all_other_countries_als_college npm run build
rm -rf $E5
mv build $E5
NODE_ENV=production REACT_APP_PC=external_latin_america_europe_aged_care npm run build
rm -rf $E6
mv build $E6
NODE_ENV=production REACT_APP_PC=external_latin_america_europe_adccd npm run build
rm -rf $E7
mv build $E7