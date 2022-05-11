#!/bin/bash

# build test

#!/bin/bash
if [ "$#" -eq  "0" ]
    then
        for file in *.js; do 
            node "$file"
        done
        exit 1
else
    file=$1
    node "$file"
fi























