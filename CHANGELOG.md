# Changelog

## [0.4.3](https://github.com/test-results-reporter/parser/compare/v0.4.2...v0.4.3) (2026-03-18)


### Miscellaneous

* rename release-please.yml to publish.yaml and add id-token: write permission ([#118](https://github.com/test-results-reporter/parser/issues/118)) ([398be63](https://github.com/test-results-reporter/parser/commit/398be6301e2d59c92cd44fc51cee4fb6eca46981))

## [0.4.2](https://github.com/test-results-reporter/parser/compare/v0.4.1...v0.4.2) (2026-03-18)


### Features

* Add startTime+endTime timestamps to test case results ([#108](https://github.com/test-results-reporter/parser/issues/108)) ([753dbaa](https://github.com/test-results-reporter/parser/commit/753dbaab12d4e8f5f3913fdcc96a88865be58808))
* added robot framework single suite file ([664f058](https://github.com/test-results-reporter/parser/commit/664f0587e16a8f2a0362f2bc69ef51cbcc70742b))
* copy duration to root from suite ([#58](https://github.com/test-results-reporter/parser/issues/58)) ([db4b903](https://github.com/test-results-reporter/parser/commit/db4b903e858c8f551d9866698c1bf8c172cb41f1))
* cucumber embeddings ([#88](https://github.com/test-results-reporter/parser/issues/88)) ([2d17efc](https://github.com/test-results-reporter/parser/commit/2d17efcd90689f905fc6a7eb005358187eb15c13))
* ignore errors wdio junit ([#60](https://github.com/test-results-reporter/parser/issues/60)) ([9948282](https://github.com/test-results-reporter/parser/commit/99482822b9a7f07e70a2da52099370336a56ce35))
* meta-data at test suite level ([#41](https://github.com/test-results-reporter/parser/issues/41)) ([51887a2](https://github.com/test-results-reporter/parser/commit/51887a2874859989fc1d14ab4b08fe8075004aae))
* nested mocha awesome suites ([4531849](https://github.com/test-results-reporter/parser/commit/45318498677efc8e96c286fdefbb01046ddfcee3))
* nested mocha awesome suites ([1acda51](https://github.com/test-results-reporter/parser/commit/1acda51e5788fdb69b80eae000d97ee7ffecafdc))
* parse v2 to handle errors ([#84](https://github.com/test-results-reporter/parser/issues/84)) ([1d82bd3](https://github.com/test-results-reporter/parser/commit/1d82bd385124968b06acfee995cae92e69300a4b))
* read multiple files ([b1222df](https://github.com/test-results-reporter/parser/commit/b1222df2cf2308f63ca4ec6b39046edf8e575b18))
* read multiple files ([b25caa1](https://github.com/test-results-reporter/parser/commit/b25caa1899ea0edf006eb5b5a373df1f92be4250))
* refactor tags and meta_data ([#76](https://github.com/test-results-reporter/parser/issues/76)) ([5f5d98c](https://github.com/test-results-reporter/parser/commit/5f5d98cb8b6abb49ead1e789cbc233f5440ee480))


### Bug Fixes

* conditional failed stop in cucumber ([cfd88fb](https://github.com/test-results-reporter/parser/commit/cfd88fb3aa57fc41e81af5280d79fc3fb6e9be5d))
* cucumber skipped tests ([#81](https://github.com/test-results-reporter/parser/issues/81)) ([a7cfa89](https://github.com/test-results-reporter/parser/commit/a7cfa893674e0a0af14b7f5f9f9cad46691fe020))
* filter suites where duration gt 0 ([b1e5cf5](https://github.com/test-results-reporter/parser/commit/b1e5cf58032fe35204af03f87411423c70a9cb35))
* handle skipped cucumber scenarios ([#109](https://github.com/test-results-reporter/parser/issues/109)) ([0917655](https://github.com/test-results-reporter/parser/commit/0917655d7b3088442fa9815979aff777bc933d4d))
* import statement ([9400bef](https://github.com/test-results-reporter/parser/commit/9400befa5085f9d9ebd446764f9b2aa31856a65b))
* junit suite skipped ([8cb6cb3](https://github.com/test-results-reporter/parser/commit/8cb6cb3e27635a6c885cbb522a32ede088aeab4e))
* junit suite skipped ([f90ad97](https://github.com/test-results-reporter/parser/commit/f90ad977b0b0190c7cd055de9cf4b385f7dddb10))
* junit system-out ([#66](https://github.com/test-results-reporter/parser/issues/66)) ([0706166](https://github.com/test-results-reporter/parser/commit/070616602a5263bafe07908d1b38bd8ded22ae9d))
* release-please failure and add PR title linting ([#115](https://github.com/test-results-reporter/parser/issues/115)) ([a2ba5f6](https://github.com/test-results-reporter/parser/commit/a2ba5f635ed9a60ad9379718fba10b380212bea8))
* step names in cucumber ([#79](https://github.com/test-results-reporter/parser/issues/79)) ([2726544](https://github.com/test-results-reporter/parser/commit/2726544158359902dac55f82e209049d1ccda9df))
* total results in junit newman ([5a06de3](https://github.com/test-results-reporter/parser/commit/5a06de361c052a0495ddc5076d69ac9cd75a401b))
* total results in junit newman ([0f189e5](https://github.com/test-results-reporter/parser/commit/0f189e5cf5c0df0a48520126d20e9aedc6b2a368))
* unescape html characters ([#37](https://github.com/test-results-reporter/parser/issues/37)) ([a44248f](https://github.com/test-results-reporter/parser/commit/a44248ff994577d128d228451b5763aff6cf10a3))


### Miscellaneous

* 0.2.8 ([256d8e4](https://github.com/test-results-reporter/parser/commit/256d8e42ea2f356f0a96840f4f5de584554661d9))
* add release-please configuration and manifest files ([#106](https://github.com/test-results-reporter/parser/issues/106)) ([4903714](https://github.com/test-results-reporter/parser/commit/49037140475e92e301b5463d0d2541a6dfc48ff0))
* bump deps ([#83](https://github.com/test-results-reporter/parser/issues/83)) ([0ab81fe](https://github.com/test-results-reporter/parser/commit/0ab81fe53d127aa4e1427a20ef084e4e246838d9))
* bump version to 0.1.15 ([f3eff75](https://github.com/test-results-reporter/parser/commit/f3eff75799db1b222deb01ea10f6ca590af4db65))
* capture metadata from cucumber ([#86](https://github.com/test-results-reporter/parser/issues/86)) ([8c9211b](https://github.com/test-results-reporter/parser/commit/8c9211bd6cec5ffbba2eab3cc26b1e34ae4f2fbf))
* cucumber refactor and capture steps ([#77](https://github.com/test-results-reporter/parser/issues/77)) ([af9fb39](https://github.com/test-results-reporter/parser/commit/af9fb392f88b02f3257e00438b0244437449b683))
* release 0.3.0 ([#107](https://github.com/test-results-reporter/parser/issues/107)) ([46da5ec](https://github.com/test-results-reporter/parser/commit/46da5ece8e77dfecfa8975a7328b104b7e943f4d))
* release 0.4.0 ([#110](https://github.com/test-results-reporter/parser/issues/110)) ([3aff8fe](https://github.com/test-results-reporter/parser/commit/3aff8fe36c5f5627488e4f78441c5aa369861208))
* release 0.4.1 ([#116](https://github.com/test-results-reporter/parser/issues/116)) ([1089442](https://github.com/test-results-reporter/parser/commit/1089442594b64960ff61d9e24c9a371f16a4dd6a))
* release-automation ([#105](https://github.com/test-results-reporter/parser/issues/105)) ([fbf1757](https://github.com/test-results-reporter/parser/commit/fbf175763db24ac43e484bd160d64fbc7b5cff2e))
* update Node.js version to 24.x in workflow ([1e95c1a](https://github.com/test-results-reporter/parser/commit/1e95c1acc83fb428c2339e002b84e3a33c492425))
* update release-please configuration ([5da66a6](https://github.com/test-results-reporter/parser/commit/5da66a656fb8d3d4581da2330c8c095a3ac3e943))
* v0.2.6 ([c1f833e](https://github.com/test-results-reporter/parser/commit/c1f833ed927bf07d50cd6a655291c7efee6dd6b2))
* v0.2.7 ([#96](https://github.com/test-results-reporter/parser/issues/96)) ([c31c776](https://github.com/test-results-reporter/parser/commit/c31c776bb67fb8bd0bb4baabf87c8d0a6eeb8410))


### Refactoring

* get parser ([780fc96](https://github.com/test-results-reporter/parser/commit/780fc96bf16a3efa5cc6f9b59daf15dda56ed4d1))

## [0.4.1](https://github.com/test-results-reporter/parser/compare/test-results-parser-v0.4.0...test-results-parser-v0.4.1) (2026-03-18)


### Bug Fixes

* release-please failure and add PR title linting ([#115](https://github.com/test-results-reporter/parser/issues/115)) ([a2ba5f6](https://github.com/test-results-reporter/parser/commit/a2ba5f635ed9a60ad9379718fba10b380212bea8))

## [0.4.0](https://github.com/test-results-reporter/parser/compare/test-results-parser-v0.3.0...test-results-parser-v0.4.0) (2025-11-28)


### Features

* Add startTime+endTime timestamps to test case results ([#108](https://github.com/test-results-reporter/parser/issues/108)) ([753dbaa](https://github.com/test-results-reporter/parser/commit/753dbaab12d4e8f5f3913fdcc96a88865be58808))


### Bug Fixes

* handle skipped cucumber scenarios ([#109](https://github.com/test-results-reporter/parser/issues/109)) ([0917655](https://github.com/test-results-reporter/parser/commit/0917655d7b3088442fa9815979aff777bc933d4d))

## [0.3.0](https://github.com/test-results-reporter/parser/compare/test-results-parser-v0.2.9...test-results-parser-v0.3.0) (2025-11-16)


### Features

* added robot framework single suite file ([664f058](https://github.com/test-results-reporter/parser/commit/664f0587e16a8f2a0362f2bc69ef51cbcc70742b))
* copy duration to root from suite ([#58](https://github.com/test-results-reporter/parser/issues/58)) ([db4b903](https://github.com/test-results-reporter/parser/commit/db4b903e858c8f551d9866698c1bf8c172cb41f1))
* cucumber embeddings ([#88](https://github.com/test-results-reporter/parser/issues/88)) ([2d17efc](https://github.com/test-results-reporter/parser/commit/2d17efcd90689f905fc6a7eb005358187eb15c13))
* ignore errors wdio junit ([#60](https://github.com/test-results-reporter/parser/issues/60)) ([9948282](https://github.com/test-results-reporter/parser/commit/99482822b9a7f07e70a2da52099370336a56ce35))
* meta-data at test suite level ([#41](https://github.com/test-results-reporter/parser/issues/41)) ([51887a2](https://github.com/test-results-reporter/parser/commit/51887a2874859989fc1d14ab4b08fe8075004aae))
* Mochawesome parser ([#64](https://github.com/test-results-reporter/parser/issues/64)) ([56290a4](https://github.com/test-results-reporter/parser/commit/56290a441bd6a6db5d989d1e2a9fe610f0663a07))
* nested mocha awesome suites ([4531849](https://github.com/test-results-reporter/parser/commit/45318498677efc8e96c286fdefbb01046ddfcee3))
* nested mocha awesome suites ([1acda51](https://github.com/test-results-reporter/parser/commit/1acda51e5788fdb69b80eae000d97ee7ffecafdc))
* parse v2 to handle errors ([#84](https://github.com/test-results-reporter/parser/issues/84)) ([1d82bd3](https://github.com/test-results-reporter/parser/commit/1d82bd385124968b06acfee995cae92e69300a4b))
* read multiple files ([b1222df](https://github.com/test-results-reporter/parser/commit/b1222df2cf2308f63ca4ec6b39046edf8e575b18))
* read multiple files ([b25caa1](https://github.com/test-results-reporter/parser/commit/b25caa1899ea0edf006eb5b5a373df1f92be4250))
* refactor tags and meta_data ([#76](https://github.com/test-results-reporter/parser/issues/76)) ([5f5d98c](https://github.com/test-results-reporter/parser/commit/5f5d98cb8b6abb49ead1e789cbc233f5440ee480))


### Bug Fixes

* conditional failed stop in cucumber ([cfd88fb](https://github.com/test-results-reporter/parser/commit/cfd88fb3aa57fc41e81af5280d79fc3fb6e9be5d))
* cucumber skipped tests ([#81](https://github.com/test-results-reporter/parser/issues/81)) ([a7cfa89](https://github.com/test-results-reporter/parser/commit/a7cfa893674e0a0af14b7f5f9f9cad46691fe020))
* filter suites where duration gt 0 ([b1e5cf5](https://github.com/test-results-reporter/parser/commit/b1e5cf58032fe35204af03f87411423c70a9cb35))
* import statement ([9400bef](https://github.com/test-results-reporter/parser/commit/9400befa5085f9d9ebd446764f9b2aa31856a65b))
* junit suite skipped ([8cb6cb3](https://github.com/test-results-reporter/parser/commit/8cb6cb3e27635a6c885cbb522a32ede088aeab4e))
* junit suite skipped ([f90ad97](https://github.com/test-results-reporter/parser/commit/f90ad977b0b0190c7cd055de9cf4b385f7dddb10))
* junit system-out ([#66](https://github.com/test-results-reporter/parser/issues/66)) ([0706166](https://github.com/test-results-reporter/parser/commit/070616602a5263bafe07908d1b38bd8ded22ae9d))
* step names in cucumber ([#79](https://github.com/test-results-reporter/parser/issues/79)) ([2726544](https://github.com/test-results-reporter/parser/commit/2726544158359902dac55f82e209049d1ccda9df))
* total results in junit newman ([5a06de3](https://github.com/test-results-reporter/parser/commit/5a06de361c052a0495ddc5076d69ac9cd75a401b))
* total results in junit newman ([0f189e5](https://github.com/test-results-reporter/parser/commit/0f189e5cf5c0df0a48520126d20e9aedc6b2a368))
* unescape html characters ([#37](https://github.com/test-results-reporter/parser/issues/37)) ([a44248f](https://github.com/test-results-reporter/parser/commit/a44248ff994577d128d228451b5763aff6cf10a3))


### Reverts

* ignore errors ([#67](https://github.com/test-results-reporter/parser/issues/67)) ([ba3af48](https://github.com/test-results-reporter/parser/commit/ba3af48baf9a63434ee067bb9d242d60e926b337))
