git pull

DIR=/var/www/years/2025

I1=$DIR/internal/asia-others-vet
I2=$DIR/internal/latam-eu-vet
I4=$DIR/internal/latam-eu-elicos
I5=$DIR/internal/asia-others-als-college
I6=$DIR/internal/latam-eu-aged-care
I7=$DIR/internal/latam-eu-adccd

E1=$DIR/external/asia-others-vet
E2=$DIR/external/latam-eu-vet
E4=$DIR/external/latam-eu-elicos
E5=$DIR/external/asia-others-als-college
E6=$DIR/external/latam-eu-aged-care
E7=$DIR/external/latam-eu-adccd


NODE_ENV=production REACT_APP_PC=internal_asia_others_vet npm run build
rm -rf $I1
mv build $I1
NODE_ENV=production REACT_APP_PC=internal_latam_eu_vet npm run build
rm -rf $I2
mv build $I2
NODE_ENV=production REACT_APP_PC=internal_latam_eu_elicos npm run build
rm -rf $I4
mv build $I4
NODE_ENV=production REACT_APP_PC=internal_asia_others_als_college npm run build
rm -rf $I5
mv build $I5
NODE_ENV=production REACT_APP_PC=internal_latam_eu_aged_care npm run build
rm -rf $I6
mv build $I6
NODE_ENV=production REACT_APP_PC=internal_latam_eu_adccd npm run build
rm -rf $I7
mv build $I7

NODE_ENV=production REACT_APP_PC=external_asia_others_vet npm run build
rm -rf $E1
mv build $E1
NODE_ENV=production REACT_APP_PC=external_latam_eu_vet npm run build
rm -rf $E2
mv build $E2
NODE_ENV=production REACT_APP_PC=external_latam_eu_elicos npm run build
rm -rf $E4
mv build $E4
NODE_ENV=production REACT_APP_PC=external_asia_others_als_college npm run build
rm -rf $E5
mv build $E5
NODE_ENV=production REACT_APP_PC=external_latam_eu_aged_care npm run build
rm -rf $E6
mv build $E6
NODE_ENV=production REACT_APP_PC=external_latam_eu_adccd npm run build
rm -rf $E7
mv build $E7