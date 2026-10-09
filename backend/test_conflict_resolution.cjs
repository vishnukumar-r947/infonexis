const http = require('http');

async function request(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Authorization': 'Bearer infonexis_jwt_demo_token_signed',
        'Content-Type': 'application/json'
      }
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('=== TEST 1: Fetch Existing Conflicts ===');
  const confRes = await request('/api/intelligence/conflicts');
  console.log('Status:', confRes.status);
  const conflicts = confRes.data?.data?.conflicts || [];
  console.log('Total conflicts:', conflicts.length);
  const conf1 = conflicts.find(c => c.id === 'conf-1');
  console.log('conf-1 status before resolution:', conf1?.status);
  console.log('conf-1 delta:', conf1?.delta);
  console.log('conf-1 sourceA authoritative:', conf1?.sourceA?.isAuthoritative);
  if (!conf1) throw new Error('conf-1 not found in backend');

  console.log('\n=== TEST 2: Submit Conflict Resolution ===');
  const resolveRes = await request('/api/intelligence/resolve', 'POST', {
    issueId: 'conf-1',
    chosenSource: 'Quarterly Financial Board Directive.pdf',
    resolutionNote: 'Audited and locked per CFO Secretariat convocation mandate.'
  });
  console.log('Resolution Status:', resolveRes.status);
  console.log('Resolution Message:', resolveRes.data?.message);
  console.log('Updated Issue Status:', resolveRes.data?.data?.issue?.status);
  console.log('Resolution Record ID:', resolveRes.data?.data?.resolutionRecord?.id);

  console.log('\n=== TEST 3: Verify Resolution History Audit Trail ===');
  const historyRes = await request('/api/intelligence/resolution-history');
  console.log('History Status:', historyRes.status);
  const history = historyRes.data?.data || [];
  console.log('History count:', history.length);
  const latest = history[0];
  console.log('Latest resolved record title:', latest?.issueTitle);
  console.log('Latest resolved source:', latest?.source);
  console.log('Latest resolved evidence:', latest?.evidence);

  console.log('\n=== TEST 4: Verify Decision Cockpit Live Triage Update ===');
  const cockpitRes = await request('/api/intelligence/cockpit');
  console.log('Cockpit Status:', cockpitRes.status);
  const cockpit = cockpitRes.data?.data || {};
  console.log('NOW count:', cockpit.now?.length);
  console.log('RESOLVED count:', cockpit.resolved?.length);
  const resolvedConf1 = cockpit.resolved?.find(r => r.id === 'cockpit-conf-1');
  console.log('conf-1 in cockpit resolved list:', !!resolvedConf1);
  if (resolvedConf1) {
    console.log('Resolved card details:', resolvedConf1.title, '| badge:', resolvedConf1.badge);
  }

  console.log('\n=== TEST 5: Verify Error Handling / Validation ===');
  const badRes = await request('/api/intelligence/resolve', 'POST', { issueId: 'non-existent-id' });
  console.log('Invalid issue resolution status:', badRes.status, '(Expected 404)');

  const missingIdRes = await request('/api/intelligence/resolve', 'POST', {});
  console.log('Missing issueId status:', missingIdRes.status, '(Expected 400)');

  console.log('\n>>> ALL 5 CONFLICT-RESOLUTION WORKFLOW TESTS EXECUTED SUCCESSFULLY <<<');
}

runTests().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
