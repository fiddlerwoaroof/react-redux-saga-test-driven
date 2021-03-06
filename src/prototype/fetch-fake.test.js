import '@testing-library/jest-dom/extend-expect'
import createFetchFake from '../test-util/fetch-fake';
import createPromiseTracker from '../test-util/promise-tracker';

test('fetch works with await', async () => {
    // given
    const fetchSpec1 = {
        uri: 'uri-1',
        responseText: 'response-text-1'
    }
    const fetchSpec2 = {
        uri: 'uri-2',
        method: 'POST',
        requestText: 'request-body-2'
    }
    const fetchSpecs = [fetchSpec1, fetchSpec2]
    const fetch = createFetchFake(fetchSpecs)

    const monitor = []

    const useFetch1 = async () => {
        const response = await fetch('uri-1')
        const text = await response.text()
        monitor.push(`fetch 1 completed with response '${text}'`)
    }

    const useFetch2 = async () => {
        await fetch('uri-2', {method: 'POST', body: 'request-body-2'})
        monitor.push(`fetch 2 completed`)
    }

    // when
    await useFetch1()
    await useFetch2()

    // then
    expect(monitor).toEqual([
        "fetch 1 completed with response 'response-text-1'",
        'fetch 2 completed'
    ])
})

test('keep track of fetch fake promises', async () => {
    // given
    const {
        attachTracking,
        waitForAllPromises
    } = createPromiseTracker()
    const fetchSpec1 = {
        uri: 'uri-1',
        responseText: 'response-text-1'
    }
    const fetchSpec2 = {
        uri: 'uri-2',
        method: 'POST',
        requestText: 'request-body-2'
    }
    const fetchSpecs = [fetchSpec1, fetchSpec2]
    const fetch = attachTracking('fetch', createFetchFake(fetchSpecs))

    const monitor = []

    const useFetch1 = async () => {
        const response = await fetch('uri-1')
        const text = await response.text()
        monitor.push(`fetch 1 completed with response '${text}'`)
    }

    const useFetch2 = async () => {
        await fetch('uri-2', {method: 'POST', body: 'request-body-2'})
        monitor.push(`fetch 2 completed`)
    }

    // when
    useFetch1()
    useFetch2()
    await waitForAllPromises()

    // then
    expect(monitor.length).toEqual(2)
    expect(monitor).toContain("fetch 1 completed with response 'response-text-1'")
    expect(monitor).toContain('fetch 2 completed')
})
