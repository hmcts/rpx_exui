for i in {1..100};
do echo "Attempt #$i";
curl -s -X $'POST' \
-H $'Host: manage-case.aat.platform.hmcts.net' -H $'X-Xsrf-Token: PwMCKmAE-qXozopS-c2kDA_iYduyc6r-8Ro8' -H $'Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryCz0M8TcOCD0bxtpa' \
-b $'xui-webapp=s%3AsVGU4Rzzu9134x1NBWbFK7ThVG0McmKw.AXjCy7jvbefYh%2F%2FZt0m1l1S66iUIAtdmd2b8NvR79bQ' \
--data-binary $'-----------------------------393921693331243990973544860898\x0d\x0aContent-Disposition: form-data; name=\"files\"; filename=\"test.txt\"\x0d\x0aContent-Type: text/plain\x0d\x0a\x0d\x0atest\x0d\x0a-----------------------------393921693331243990973544860898\x0d\x0aContent-Disposition: form-data; name=\"classification\"\x0d\x0a\x0d\x0aPUBLIC\x0d\x0a-----------------------------393921693331243990973544860898\x0d\x0aContent-Disposition: form-data; name=\"caseTypeId\"\x0d\x0a\x0d\x0aCIVIL\x0d\x0a-----------------------------393921693331243990973544860898\x0d\x0aContent-Disposition: form-data; name=\"jurisdictionId\"\x0d\x0a\x0d\x0atest\x0d\x0a-----------------------------393921693331243990973544860898--\x0d\x0a' \
$'https://manage-case.demo.platform.hmcts.net/documents';
done
